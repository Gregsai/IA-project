const pool = require("../../config/database");
const Tournament = require("../models/tournament");

async function createTournament(
  organizer,
  name,
  discipline,
  date,
  maxParticipants,
  applicationDeadline,
  address,
  seedingType,
  sponsors
  ) {
    try {
      const tournamentInsertQuery = `
        INSERT INTO tournaments(organizer, name, discipline, date, maxParticipants, applicationdeadline, address, seedingtype)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`;
      const tournamentInsertValues = [
        organizer,
        name,
        discipline,
        date,
        maxParticipants,
        applicationDeadline,
        address,
        seedingType,
      ];
      console.log("inserted values",tournamentInsertValues)
      const tournamentResult = await pool.query(tournamentInsertQuery, tournamentInsertValues);
      const tournamentId = tournamentResult.rows[0].id;
      console.log(tournamentResult)

      console.log(tournamentId);
      if (sponsors && sponsors.length > 0) {
        for (const sponsor of sponsors) {
          const { name, url, imageurl } = sponsor;
          const sponsorInsertQuery = `
            INSERT INTO sponsors(name, url, tournament, imageurl)
            VALUES($1, $2, $3, $4)`;
          const sponsorInsertValues = [
            name || null,
            url || null,
            tournamentId,
            imageurl || null,
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