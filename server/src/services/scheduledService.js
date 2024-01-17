const cron = require('node-cron');
const pool = require("../../config/database");

checkRoundCompletionForAllTournaments();
checkGenerateLadders()
async function checkGenerateLadders() {
    try {
        const tournamentsQuery = `
            SELECT id
            FROM tournaments;
        `;
        const tournamentsResult = await pool.query(tournamentsQuery);
        const tournamentIds = tournamentsResult.rows.map(tournament => tournament.id);

        for (const tournamentId of tournamentIds) {
            await generateLadder(tournamentId);
        }

        console.log("Application deadlines checked for all tournaments.");
    } catch (error) {
        console.error("Error checking application deadlines for all tournaments:", error);
        throw error;
    }
}

async function generateLadder(tournamentId) {
    try {
        const deadlineQuery = `
            SELECT applicationdeadline, seedingtype
            FROM tournaments
            WHERE id = $1
        `;
        const deadlineResult = await pool.query(deadlineQuery, [tournamentId]);

        if (deadlineResult.rows.length === 0) {
            console.error("Tournament not found.");
            return false;
        }

        const applicationDeadline = new Date(deadlineResult.rows[0].applicationdeadline);

        // Vérifier si la date limite d'inscription est passée
        if (new Date() > applicationDeadline) {
            const seedingType = deadlineResult.rows[0].seedingtype;

            // Vérifier si le ladder a déjà été initialisé
            const roundsQuery = `
                SELECT COUNT(*) AS count
                FROM rounds
                WHERE tournament = $1
            `;
            const roundsResult = await pool.query(roundsQuery, [tournamentId]);
            const roundsCount = roundsResult.rows[0].count;

            // Vérifier le nombre de participants
            const participantsCountQuery = `
                SELECT COUNT(*) AS count
                FROM participants
                WHERE tournament = $1
            `;
            const participantsCountResult = await pool.query(participantsCountQuery, [tournamentId]);
            const participantsCount = participantsCountResult.rows[0].count;

            if (roundsCount == 0 && participantsCount > 0) {
                if (seedingType === 'Random') {
                    await generateRandomLadder(tournamentId);
                } else if (seedingType === 'By Rank') {
                    await generateRankLadder(tournamentId);
                }

                return true; // La date limite est passée, le ladder n'a pas encore été initialisé, et le nombre de participants n'est pas nul
            } else {
                console.log("Ladder has already been initialized for this tournament or participants count is zero.");
                return true; // La date limite est passée, mais le ladder a déjà été initialisé ou le nombre de participants est nul
            }
        }

        return false; // La date limite n'est pas encore passée
    } catch (error) {
        console.error("Error checking application deadline:", error);
        throw error;
    }
}



async function generateRandomLadder(tournamentId) {
    try {
        const participantsQuery = `
            SELECT id AS participant_id
            FROM participants
            WHERE tournament = $1
        `;
        const participantsResult = await pool.query(participantsQuery, [tournamentId]);
        const participants = participantsResult.rows.map(participant => participant.participant_id);

        const shuffledParticipants = shuffleArray(participants);

        const createRoundQuery = `
            INSERT INTO rounds (tournament, round)
            VALUES ($1, 1)
            RETURNING id;
        `;
        const createRoundResult = await pool.query(createRoundQuery, [tournamentId]);
        const roundId = createRoundResult.rows[0].id;

        const matchesQuery = `
            INSERT INTO matches (round, participant1, participant2, winner)
            VALUES ($1, $2, $3, $4)
        `;

        for (let i = 0; i < shuffledParticipants.length; i += 2) {
            const participant1 = shuffledParticipants[i];
            const participant2 = shuffledParticipants[i + 1] || null;

            const winner = participant2 === null ? participant1 : null;

            await pool.query(matchesQuery, [roundId, participant1, participant2, winner]);
        }

        console.log(`Random ladder generated for tournament ${tournamentId}`);
    } catch (error) {
        console.error("Error generating random ladder:", error);
        throw error;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function generateRankLadder(tournamentId) {
    try {
        const participantsQuery = `
            SELECT id AS participant_id
            FROM participants
            WHERE tournament = $1
            ORDER BY rank;
        `;
        const participantsResult = await pool.query(participantsQuery, [tournamentId]);
        const participants = participantsResult.rows.map(participant => participant.participant_id);

        const createRoundQuery = `
            INSERT INTO rounds (tournament, round)
            VALUES ($1, 1)
            RETURNING id;
        `;
        const createRoundResult = await pool.query(createRoundQuery, [tournamentId]);
        const roundId = createRoundResult.rows[0].id;

        const matchesQuery = `
            INSERT INTO matches (round, participant1, participant2, winner)
            VALUES ($1, $2, $3, $4)
        `;

        for (let i = 0; i < participants.length; i += 2) {
            const participant1 = participants[i];
            const participant2 = participants[i + 1] || null;

            const winner = participant2 === null ? participant1 : null;

            await pool.query(matchesQuery, [roundId, participant1, participant2, winner]);
        }

        console.log(`Rank-based ladder generated for tournament ${tournamentId}`);
    } catch (error) {
        console.error("Error generating rank-based ladder:", error);
        throw error;
    }
}

async function checkRoundCompletion(tournamentId, roundNumber) {
    try {
        const roundQuery = `
            SELECT id
            FROM rounds
            WHERE tournament = $1 AND round = $2
        `;
        const roundResult = await pool.query(roundQuery, [tournamentId, roundNumber]);

        if (roundResult.rows.length === 0) {
            console.error(`Round ${roundNumber} not found for tournament ${tournamentId}.`);
            return false;
        }

        const roundId = roundResult.rows[0].id;

        const matchesQuery = `
            SELECT id, winner
            FROM matches
            WHERE round = $1
        `;
        const matchesResult = await pool.query(matchesQuery, [roundId]);

        const allMatchesCompleted = matchesResult.rows.every(match => match.winner !== null);

        if (allMatchesCompleted) {
            console.log(`All matches for round ${roundNumber} of tournament ${tournamentId} are completed.`);
            await generateNextRound(tournamentId, roundNumber + 1);
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error checking round completion:", error);
        throw error;
    }
}


async function checkRoundCompletionForAllTournaments() {
    try {
        const tournamentsQuery = `
            SELECT id
            FROM tournaments
            WHERE date < NOW();
        `;
        const tournamentsResult = await pool.query(tournamentsQuery);
        for (const tournament of tournamentsResult.rows) {
            const tournamentId = tournament.id;
            const currentRoundId = await getCurrentRoundId(tournamentId);

            if (currentRoundId) {
                await checkRoundCompletion(tournamentId, currentRoundId);
            }
        }

        console.log("Round completion checked for all relevant tournaments.");
    } catch (error) {
        console.error("Error checking round completion for all tournaments:", error);
        throw error;
    }
}

async function getCurrentRoundId(tournamentId) {
    try {
        const currentRoundQuery = `
            SELECT id
            FROM rounds
            WHERE tournament = $1
            ORDER BY round DESC
            LIMIT 1;
        `;
        const currentRoundResult = await pool.query(currentRoundQuery, [tournamentId]);

        return currentRoundResult.rows.length > 0 ? currentRoundResult.rows[0].id : null;
    } catch (error) {
        console.error("Error getting current round:", error);
        throw error;
    }
}

async function checkRoundCompletion(tournamentId, roundId) {
    try {
        const matchesQuery = `
            SELECT id, winner
            FROM matches
            WHERE round = $1
        `;
        const matchesResult = await pool.query(matchesQuery, [roundId]);

        const allMatchesCompleted = matchesResult.rows.every(match => match.winner !== null);

        if (allMatchesCompleted) {
            console.log(`All matches for round ${roundId} of tournament ${tournamentId} are completed.`);
            await generateNextRound(tournamentId, roundId);
        }
    } catch (error) {
        console.error("Error checking round completion:", error);
        throw error;
    }
}

async function generateNextRound(tournamentId, previousRoundId) {
    try {
        // Vérifier combien de matches le round précédent avait
        const matchCountQuery = `
            SELECT COUNT(*) AS match_count
            FROM matches
            WHERE round = $1;
        `;
        const matchCountResult = await pool.query(matchCountQuery, [previousRoundId]);
        const matchCount = matchCountResult.rows[0].match_count;

        // Si le round précédent avait plus d'un match, procéder à la génération du nouveau round
        if (matchCount > 1) {
            // Récupérer les gagnants des matches du round précédent dans l'ordre des matches
            const winnersQuery = `
                SELECT winner
                FROM matches
                WHERE round = $1
                ORDER BY id;
            `;
            const winnersResult = await pool.query(winnersQuery, [previousRoundId]);

            const winners = winnersResult.rows.map(match => match.winner);

            // Créer un nouveau round avec le numéro de round suivant
            const createRoundQuery = `
                INSERT INTO rounds (tournament, round)
                VALUES ($1, (SELECT round + 1 FROM rounds WHERE id = $2))
                RETURNING id;
            `;
            const createRoundResult = await pool.query(createRoundQuery, [tournamentId, previousRoundId]);
            const newRoundId = createRoundResult.rows[0].id;

            // Créer de nouveaux matches pour le nouveau round avec les gagnants du round précédent
            const matchesQuery = `
                INSERT INTO matches (round, participant1, participant2)
                VALUES ($1, $2, $3)
            `;

            // Séparer les gagnants en paires pour les matches du nouveau round
            for (let i = 0; i < winners.length; i += 2) {
                const participant1 = winners[i];
                const participant2 = winners[i + 1] || null;

                await pool.query(matchesQuery, [newRoundId, participant1, participant2]);
            }

            console.log(`Next round generated for tournament ${tournamentId}.`);
        } else {
            console.log(`No next round generated for tournament ${tournamentId} due to single match in previous round.`);
        }
    } catch (error) {
        console.error("Error generating next round:", error);
        throw error;
    }
}





