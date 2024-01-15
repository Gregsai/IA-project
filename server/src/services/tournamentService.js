const pool = require("../../config/database");



async function getUpcomingTournamentsPage(startIndex, endIndex, searchTerm) {
    try {
        startIndex = parseInt(startIndex, 10);
        endIndex = parseInt(endIndex, 10);
        let countQuery = `
            SELECT COUNT(*) FROM tournaments 
            WHERE name ILIKE $1
        `;

        let values = [`%${searchTerm}%`];
        const numberOfFilteredTournaments = await pool.query(countQuery, values);
        console.log("There is ",numberOfFilteredTournaments.rows[0].count);
        let offset = 0;
        if (startIndex !== 0) {
            console.log("Start index: " + startIndex)
            offset = (startIndex - 1);
        }

        let query = `
            SELECT * FROM tournaments
            WHERE name ILIKE $1
            ORDER BY date
            LIMIT $2 OFFSET $3
        `;

        const limit = endIndex - startIndex;
        console.log("startIndex: " + startIndex)
        console.log("limit: " + limit)
        const result = await pool.query(query, [`%${searchTerm}%`, limit, startIndex]);
        return {
            totalCount: numberOfFilteredTournaments.rows[0].count,
            tournaments: result.rows
        };
    } catch (error) {
        console.error("Error getting tournaments per page:", error);
        throw error;
    }
}

async function getTournamentInformation(id) {
    try {
        const query = `
            SELECT tournaments.*, users.email as organizer_email
            FROM tournaments
            JOIN users ON tournaments.organizer = users.id
            WHERE tournaments.id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new Error(`Tournament with id ${id} not found`);
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error getting tournament information:", error);
        throw error;
    }
}


async function getTournamentSponsors(id) {
    try {
        const query = `
            SELECT * FROM sponsors
            WHERE tournament = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error("Error getting tournament sponsors:", error);
        throw error;
    }
}

async function getTournamentParticipantsList(id) {
    try {
        const query = `
            SELECT participants.*, users.email as participant_email
            FROM participants
            JOIN users ON participants.participant = users.id
            WHERE participants.tournament = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error("Error getting tournament participants list:", error);
        throw error;
    }
}


async function participate(tournamentId, userId) {
    try {
        const countQuery = `
            SELECT COUNT(*) AS count
            FROM participants
            WHERE tournament = $1
        `;
        const countResult = await pool.query(countQuery, [tournamentId]);
        const currentParticipantsCount = countResult.rows[0].count;

        const maxParticipantsQuery = `
            SELECT maxparticipants
            FROM tournaments
            WHERE id = $1
        `;
        const maxParticipantsResult = await pool.query(maxParticipantsQuery, [tournamentId]);
        const maxParticipants = maxParticipantsResult.rows[0].maxparticipants;

        if (currentParticipantsCount < maxParticipants) {
            const insertQuery = `
                INSERT INTO participants (tournament, participant)
                VALUES ($1, $2)
            `;
            const result = await pool.query(insertQuery, [tournamentId, userId]);
            return result.rows;
        } else {
            console.error("The maximum number of participants has been reached for this tournament.");
            return "Max number of participants reached";
        }
    } catch (error) {
        console.error("Error while participating to the tournament", error);
        throw error;
    }
}

async function unparticipate(tournamentId, userId){
    try {
        const query = `
            DELETE FROM participants
            WHERE tournament = $1 AND participant = $2
        `;
        const result = await pool.query(query, [tournamentId, userId]);
        return result.rows;
    } catch (error) {
        console.error("Error unparticipating in tournament:", error);
        throw error;
    }
}

async function isUserAParticipantOfTournament(tournamentId, userId){
    console.log("userid", userId);
    console.log("tournament id", tournamentId);
    try {
        const query = `
            SELECT * FROM participants
            WHERE tournament = $1 AND participant = $2
        `;
        const result = await pool.query(query, [tournamentId, userId]);
        return result.rows.length > 0;
    } catch (error) {
        console.error("Error checking if user is participant of tournament:", error);
        throw error;
    }
}

async function isUserOrganizerOfTournament(tournamentId, userId) {
    try {
        const query = `
            SELECT * FROM tournaments
            WHERE id = $1 AND organizer = $2
        `;
        const result = await pool.query(query, [tournamentId, userId]);
        return result.rows.length > 0;
    } catch (error) {
        console.error("Error checking if user is organizer of tournament:", error);
        throw error;
    }
}

module.exports = {
  getUpcomingTournamentsPage,
  getTournamentInformation,
  getTournamentSponsors,
  getTournamentParticipantsList,
  participate,
  unparticipate,
  isUserAParticipantOfTournament,
  isUserOrganizerOfTournament
};
