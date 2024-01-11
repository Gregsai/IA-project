const pool = require("../../config/database");

async function getNumberOfUpcomingTournaments() {
    try {
      const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
      const query = `SELECT COUNT(*) AS count FROM tournaments WHERE date >= '${currentDate}'`;
      const result = await pool.query(query);
  
      if (result.rowCount > 0 && result.rows[0].count !== null) {
        const numberOfUpcomingTournaments = parseInt(result.rows[0].count, 10);
        return numberOfUpcomingTournaments;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error getting number of upcoming tournaments:", error);
      throw error;
    }
  }



async function getTournamentsPerPage(startIndex, endIndex, searchTerm) {
    try {
        console.log("search term :",searchTerm);
        
        console.log("start index:",startIndex);
        console.log("end index :",endIndex);
        let offset = 0;
        if(startIndex != 0){
            offset = (startIndex - 1) * 10; 
        }
        const limit = endIndex - startIndex;
        const query = `
            SELECT * FROM tournaments
            WHERE name ILIKE $1
            ORDER BY date
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [`%${searchTerm}%`, limit, offset]);
        console.log(result);
        return result.rows;
    } catch (error) {
        console.error("Error getting tournaments per page:", error);
        throw error;
    }
}

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



module.exports = {
  getNumberOfUpcomingTournaments,
  getTournamentsPerPage,
  getUpcomingTournamentsPage
};
