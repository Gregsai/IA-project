const pool = require("../../config/database");

async function getUpcomingTournamentsPage(startIndex, endIndex, searchTerm) {
  try {
    startIndex = parseInt(startIndex, 10);
    endIndex = parseInt(endIndex, 10);
    let countQuery = `
            SELECT COUNT(*) FROM tournaments 
            WHERE name ILIKE $1 AND applicationdeadline > NOW()
        `;

    let values = [`%${searchTerm}%`];
    const numberOfFilteredTournaments = await pool.query(countQuery, values);
    let offset = 0;
    if (startIndex !== 0) {
      offset = startIndex - 1;
    }

    let query = `
            SELECT * FROM tournaments
            WHERE name ILIKE $1 AND applicationdeadline > NOW()
            ORDER BY date
            LIMIT $2 OFFSET $3 
        `;

    const limit = endIndex - startIndex;
    const result = await pool.query(query, [
      `%${searchTerm}%`,
      limit,
      startIndex,
    ]);

    return {
      totalCount: numberOfFilteredTournaments.rows[0].count,
      tournaments: result.rows,
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
    const maxParticipantsResult = await pool.query(maxParticipantsQuery, [
      tournamentId,
    ]);
    const maxParticipants = maxParticipantsResult.rows[0].maxparticipants;

    if (currentParticipantsCount < maxParticipants) {
      const insertQuery = `
                INSERT INTO participants (tournament, participant)
                VALUES ($1, $2)
            `;
      const result = await pool.query(insertQuery, [tournamentId, userId]);
      return result.rows;
    } else {
      console.error(
        "The maximum number of participants has been reached for this tournament."
      );
      return "Max number of participants reached";
    }
  } catch (error) {
    console.error("Error while participating to the tournament", error);
    throw error;
  }
}

async function unparticipate(tournamentId, userId) {
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

async function isUserAParticipantOfTournament(tournamentId, userId) {
  try {
    const query = `
            SELECT * FROM participants
            WHERE tournament = $1 AND participant = $2
        `;
    const result = await pool.query(query, [tournamentId, userId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error(
      "Error checking if user is participant of tournament:",
      error
    );
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

async function getIntoTournament(tournamentId, userId, licenceNumber, ranking) {
  try {
    const deadlineQuery = `
        SELECT applicationdeadline
        FROM tournaments
        WHERE id = $1
      `;
    const deadlineResult = await pool.query(deadlineQuery, [tournamentId]);

    if (deadlineResult.rows.length === 0) {
      console.error("Tournament not found.");
      return "Tournament not found";
    }

    const applicationDeadline = deadlineResult.rows[0].applicationdeadline;

    if (new Date(applicationDeadline) < new Date()) {
      console.error("The application deadline for this tournament has passed.");
      return "Application deadline has passed";
    }
    const existingParticipantQuery = `
      SELECT COUNT(*) AS count
      FROM participants
      WHERE tournament = $1 AND participant = $2
    `;
    const existingParticipantResult = await pool.query(
      existingParticipantQuery,
      [tournamentId, userId]
    );
    const existingParticipantCount = existingParticipantResult.rows[0].count;

    if (existingParticipantCount > 0) {
      console.error("User is already a participant in this tournament.");
      return "User is already a participant";
    }

    const existingRankQuery = `
    SELECT COUNT(*) AS count
    FROM participants
    WHERE tournament = $1 AND rank = $2 AND rank > 0
  `;
    const existingRankResult = await pool.query(existingRankQuery, [
      tournamentId,
      ranking,
    ]);
    const existingRankCount = existingRankResult.rows[0].count;

    if (existingRankCount > 0) {
      console.error(
        "Another participant with the same rank already exists in this tournament."
      );
      return "Duplicate rank in the tournament";
    }

    const existingLicenceQuery = `
    SELECT COUNT(*) AS count
    FROM participants
    WHERE tournament = $1 AND licence = $2
  `;
    const existingLicenceResult = await pool.query(existingLicenceQuery, [
      tournamentId,
      licenceNumber,
    ]);
    const existingLicenceCount = existingLicenceResult.rows[0].count;

    if (existingLicenceCount > 0) {
      console.error(
        "Another participant with the same licence already exists in this tournament."
      );
      return "Duplicate licence in the tournament";
    }
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
    const maxParticipantsResult = await pool.query(maxParticipantsQuery, [
      tournamentId,
    ]);
    const maxParticipants = maxParticipantsResult.rows[0].maxparticipants;

    if (currentParticipantsCount < maxParticipants) {
      const insertParticipantQuery = `
          INSERT INTO participants (tournament, participant, licence, rank)
          VALUES ($1, $2, $3, $4)
        `;

      await pool.query(insertParticipantQuery, [
        tournamentId,
        userId,
        licenceNumber,
        ranking,
      ]);

      return;
    } else {
      console.error(
        "The maximum number of participants has been reached for this tournament."
      );
      return "Max number of participants reached";
    }
  } catch (error) {
    console.error("Error while participating in the tournament", error);
    throw error;
  }
}

async function getUserTournamentsPage(
  startIndex,
  endIndex,
  searchTerm,
  userId
) {
  try {
    startIndex = parseInt(startIndex, 10);
    endIndex = parseInt(endIndex, 10);
    let countQuery = `
            SELECT COUNT(*) FROM tournaments 
            WHERE name ILIKE $1 AND organizer = $2
        `;

    let values = [`%${searchTerm}%`, userId];
    const numberOfFilteredTournaments = await pool.query(countQuery, values);
    let offset = 0;
    if (startIndex !== 0) {
      offset = startIndex - 1;
    }

    let query = `
            SELECT * FROM tournaments
            WHERE name ILIKE $1 AND organizer = $2
            ORDER BY date
            LIMIT $3 OFFSET $4 
        `;

    const limit = endIndex - startIndex;
    const result = await pool.query(query, [
      `%${searchTerm}%`,
      userId,
      limit,
      startIndex,
    ]);

    return {
      totalCount: numberOfFilteredTournaments.rows[0].count,
      tournaments: result.rows,
    };
  } catch (error) {
    console.error("Error getting tournaments per page:", error);
    throw error;
  }
}

async function getEnrolledInTournamentsPage(
  startIndex,
  endIndex,
  searchTerm,
  userId
) {
  try {
    startIndex = parseInt(startIndex, 10);
    endIndex = parseInt(endIndex, 10);

    let countQuery = `
      SELECT COUNT(*) FROM tournaments 
      WHERE name ILIKE $1 AND id IN (SELECT tournament FROM participants WHERE participant = $2)
    `;

    let values = [`%${searchTerm}%`, userId];
    const numberOfFilteredTournaments = await pool.query(countQuery, values);

    let offset = 0;
    if (startIndex !== 0) {
      offset = startIndex - 1;
    }

    let query = `
      SELECT * FROM tournaments
      WHERE name ILIKE $1 AND id IN (SELECT tournament FROM participants WHERE participant = $2)
      ORDER BY date
      LIMIT $3 OFFSET $4 
    `;

    const limit = endIndex - startIndex;
    const result = await pool.query(query, [
      `%${searchTerm}%`,
      userId,
      limit,
      startIndex,
    ]);

    return {
      totalCount: numberOfFilteredTournaments.rows[0].count,
      tournaments: result.rows,
    };
  } catch (error) {
    console.error("Error getting tournaments per page:", error);
    throw error;
  }
}

async function getTournamentLadder(id) {
  try {
    const query = `
    SELECT participants.*, users.email as participant_email
    FROM participants
    JOIN users ON participants.participant = users.id
    WHERE participants.tournament = $1
    ORDER BY participants.score DESC, 
             CASE WHEN participants.rank <> 0 THEN participants.rank ELSE NULL END ASC
  `;
    const result = await pool.query(query, [id]);
    const ladder = result.rows;
    return { ladder };
  } catch (error) {
    console.error("Error getting ladder:", error);
    throw error;
  }
}

async function getTournamentTree(id) {
  try {
    const query = `
    SELECT
      m.id AS match_id,
      r.id AS round_id,
      m.participant1,
      u1.email AS participant1_email,
      m.participant2,
      u2.email AS participant2_email,
      m.winner,
      uw.email AS winner_email
    FROM
      matches m
      INNER JOIN rounds r ON m.round = r.id
      LEFT JOIN participants p1 ON m.participant1 = p1.id
      LEFT JOIN participants p2 ON m.participant2 = p2.id
      LEFT JOIN participants pw ON m.winner = pw.id
      LEFT JOIN users u1 ON p1.participant = u1.id
      LEFT JOIN users u2 ON p2.participant = u2.id
      LEFT JOIN users uw ON pw.participant = uw.id
    WHERE
      r.tournament = $1
    ORDER BY
      r.id, m.id;
  `;  
    const result = await pool.query(query, [id]);

    const tree = {};
    result.rows.forEach((match) => {
      const roundId = match.round_id;
      if (!tree[roundId]) {
        tree[roundId] = [];
      }
      tree[roundId].push(match);
    });

    return { tree };
  } catch (error) {
    console.error("Error getting tournament tree:", error);
    throw error;
  }
}


async function getUserMatches(id, userId) {
  try {
    const query = `
      SELECT 
        matches.*, 
        rounds.round, 
        users1.email as participant1_email, 
        users2.email as participant2_email
      FROM matches
      JOIN rounds ON matches.round = rounds.id
      JOIN participants AS p1 ON matches.participant1 = p1.id
      JOIN participants AS p2 ON matches.participant2 = p2.id
      JOIN users AS users1 ON p1.participant = users1.id
      JOIN users AS users2 ON p2.participant = users2.id
      WHERE
        (p1.participant = $1 OR p2.participant = $1)
        AND rounds.tournament = $2
      ORDER BY rounds.round;
    `;

    const result = await pool.query(query, [userId, id]);
    const userMatches = result.rows;

    const query2 = `
    SELECT 
    id
  FROM participants
  WHERE participant = $1 AND tournament = $2;
`;
    const result2 = await pool.query(query2, [userId, id]);
    const userParticipantId = result2.rows[0].id;
    return { userMatches, userParticipantId };
  } catch (error) {
    console.error("Error getting user matches:", error);
    throw error;
  }
}

async function selectWinner(participantId, matchId, userParticipantId) {
  try {
    const matchQuery = `
      SELECT participant1, participant2
      FROM matches
      WHERE id = $1
    `;
    const matchResult = await pool.query(matchQuery, [matchId]);
    const { participant1, participant2 } = matchResult.rows[0];

    let winnerColumnToUpdate;
    if (participant1 === userParticipantId) {
      winnerColumnToUpdate = "winnerparticipant1";
    } else if (participant2 === userParticipantId) {
      winnerColumnToUpdate = "winnerparticipant2";
    } else {
      throw new Error(
        "userParticipantId ne correspond à aucun participant dans le match."
      );
    }

    const updateQuery = `
      UPDATE matches
      SET ${winnerColumnToUpdate} = $1
      WHERE id = $2
    `;
    await pool.query(updateQuery, [participantId, matchId]);

    await updateWinner(matchId);
  } catch (error) {
    console.error("Error selecting winner:", error);
    throw error;
  }
}

async function updateWinner(matchId) {
  try {
    const matchQuery = `
      SELECT participant1, participant2, winnerparticipant1, winnerparticipant2
      FROM matches
      WHERE id = $1
    `;
    const matchResult = await pool.query(matchQuery, [matchId]);
    const {
      participant1,
      participant2,
      winnerparticipant1,
      winnerparticipant2,
    } = matchResult.rows[0];

    if (!winnerparticipant1 || !winnerparticipant2) {
      return;
    } else if (winnerparticipant1 !== winnerparticipant2) {
      const resetQuery = `
        UPDATE matches
        SET winnerparticipant1 = NULL, winnerparticipant2 = NULL
        WHERE id = $1`;
      await pool.query(resetQuery, [matchId]);
    } else {
      const updateWinner = `
        UPDATE matches
        SET winner = $1
        WHERE id = $2`;
      await pool.query(updateWinner, [winnerparticipant1, matchId]);

      const updateScoreQuery = `
      UPDATE participants
      SET score = score + 1
      WHERE id = $1`;
      await pool.query(updateScoreQuery, [winnerparticipant1]);
    }
  } catch (error) {
    console.error("Error updating winner:", error);
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
  isUserOrganizerOfTournament,
  getIntoTournament,
  getUserTournamentsPage,
  getEnrolledInTournamentsPage,
  getTournamentLadder,
  getTournamentTree,
  getUserMatches,
  selectWinner,
  updateWinner,
};
