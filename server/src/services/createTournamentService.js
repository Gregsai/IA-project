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

  async function editTournament(
    id,
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
      const organizerCheckQuery = `
        SELECT COUNT(*) as count
        FROM tournaments
        WHERE id = $1 AND organizer = $2`;
      const organizerCheckValues = [id, organizer];
      const organizerCheckResult = await pool.query(organizerCheckQuery, organizerCheckValues);
  
      if (organizerCheckResult.rows[0].count === 0) {
        return { success: false, message: 'Organizer is not linked to the tournament' };
      }

      const tournamentInsertQuery = `
        UPDATE tournaments
        SET name = $1, discipline = $2, date = $3, maxparticipants = $4, applicationdeadline = $5, address = $6, seedingtype = $7
        WHERE id = $8`;
      const tournamentInsertValues = [
        name,
        discipline,
        date,
        maxParticipants,
        applicationDeadline,
        address,
        seedingType,
        id
      ];
      const tournamentResult = await pool.query(tournamentInsertQuery, tournamentInsertValues);
      const deleteSponsorsQuery = `
      DELETE FROM sponsors
      WHERE tournament = $1`;
    const deleteSponsorsValues = [id];
    
    // Delete existing sponsors for the tournament
    await pool.query(deleteSponsorsQuery, deleteSponsorsValues);
    
    // Insert new sponsors one by one
    if (sponsors && sponsors.length > 0) {
      for (const sponsor of sponsors) {
        console.log(sponsor);
        const { name, url, tournament, imageurl } = sponsor;
        const sponsorInsertQuery = `
          INSERT INTO sponsors(name, url, tournament, imageurl)
          VALUES($1, $2, $3, $4)`;
        const sponsorInsertValues = [
          name || null,
          url || null,
          id, // Use the original tournament id
          imageurl || null,
        ];
        await pool.query(sponsorInsertQuery, sponsorInsertValues);
      }
    }
  
      return { success: true, message: 'Tournament updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
module.exports = {
    createTournament,
    editTournament
  };