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
            SELECT * FROM tournaments
            WHERE id = $1
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
            SELECT * FROM participants
            WHERE tournament = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error("Error getting tournament participants list:", error);
        throw error;
    }
}


module.exports = {
  getUpcomingTournamentsPage,
  getTournamentInformation,
  getTournamentSponsors,
  getTournamentParticipantsList,
};
