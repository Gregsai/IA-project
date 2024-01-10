const pool = require("../../config/database");

async function createTournament(
    id,
    name,
    discipline,
    seedingType,
    dateTime,
    address,
    participantLimit,
    registrationDeadline,
    sponsors
  ) {
    console.log("creating tournament")
    try {
      const tournamentInsertQuery = `
        INSERT INTO tournaments(organizer, name, discipline, date, maxparticipants, applicationdeadline, address, seedingtype)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`;
      const tournamentInsertValues = [
        id,
        name,
        discipline,
        dateTime,
        participantLimit,
        registrationDeadline,
        address,
        seedingType,
      ];
      console.log(tournamentInsertValues)

      const tournamentResult = await pool.query(tournamentInsertQuery, tournamentInsertValues);
      const tournamentId = tournamentResult.rows[0].id;
      console.log(tournamentResult)

  
      if (sponsors && sponsors.length > 0) {
        for (const sponsor of sponsors) {
          const { name, url, imageUrl } = sponsor;
  
          const sponsorInsertQuery = `
            INSERT INTO sponsors(name, url, imageUrl, tournament)
            VALUES($1, $2, $3, $4)`;
          const sponsorInsertValues = [
            name || null,
            url || null,
            imageUrl || null,
            tournamentId
          ];
  
          await pool.query(sponsorInsertQuery, sponsorInsertValues);
        }
      }
  
      return { success: true, message: 'Tournament created successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
module.exports = {
    createTournament,
  };