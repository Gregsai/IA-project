const pool = require("../../config/database");

async function getNumberOfUpcomingTournaments() {
    try {
      const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
      const query = `SELECT COUNT(*) AS count FROM tournaments WHERE date >= '${currentDate}'`;
      const result = await pool.query(query);
  
      if (result.rowCount > 0 && result.rows[0].count !== null) {
        const numberOfUpcomingTournaments = parseInt(result.rows[0].count, 10);
        return { success: true, message: numberOfUpcomingTournaments };
      } else {
        return { success: false, message: "No upcoming tournaments found." };
      }
    } catch (error) {
      console.error("Error getting number of upcoming tournaments:", error);
      throw error;
    }
  }
module.exports = {
  getNumberOfUpcomingTournaments,
};
