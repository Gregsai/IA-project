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

    console.log("There is ", result.rows);
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
    
    console.log("licence", licenceNumber)
    console.log("rank", ranking);
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
    const existingParticipantResult = await pool.query(existingParticipantQuery, [tournamentId, userId]);
    const existingParticipantCount = existingParticipantResult.rows[0].count;

    if (existingParticipantCount > 0) {
      console.error("User is already a participant in this tournament.");
      return "User is already a participant";
    }
    
    const existingRankQuery = `
    SELECT COUNT(*) AS count
    FROM participants
    WHERE tournament = $1 AND rank = $2
  `;
  const existingRankResult = await pool.query(existingRankQuery, [tournamentId, ranking]);
  const existingRankCount = existingRankResult.rows[0].count;

  if (existingRankCount > 0) {
    console.error("Another participant with the same rank already exists in this tournament.");
    return "Duplicate rank in the tournament";
  }

  // Vérifier s'il n'y a pas d'autre participant avec la même licence
  const existingLicenceQuery = `
    SELECT COUNT(*) AS count
    FROM participants
    WHERE tournament = $1 AND licence = $2
  `;
  const existingLicenceResult = await pool.query(existingLicenceQuery, [tournamentId, licenceNumber]);
  const existingLicenceCount = existingLicenceResult.rows[0].count;

  if (existingLicenceCount > 0) {
    console.error("Another participant with the same licence already exists in this tournament.");
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
      const maxParticipantsResult = await pool.query(maxParticipantsQuery, [tournamentId]);
      const maxParticipants = maxParticipantsResult.rows[0].maxparticipants;
  
      if (currentParticipantsCount < maxParticipants) {
        // Ajouter un nouveau participant avec les attributs licence et ranking
        const insertParticipantQuery = `
          INSERT INTO participants (tournament, participant, licence, rank)
          VALUES ($1, $2, $3, $4)
        `;
          
        await pool.query(insertParticipantQuery, [tournamentId, userId, licenceNumber, ranking]);
  
        return;
      } else {
        console.error("The maximum number of participants has been reached for this tournament.");
        return "Max number of participants reached";
      }
    } catch (error) {
      console.error("Error while participating in the tournament", error);
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
};
