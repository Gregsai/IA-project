const tournamentService = require("../services/tournamentService");

async function getNumberOfUpcomingTournaments(req, res) {
    try {
        const result = await tournamentService.getNumberOfUpcomingTournaments();
        if (result !== null && result !== undefined) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ error: 'no upcoming tournaments' });
        }
    } catch (error) {
        return res.status(500).json({
            error: "Error getting number of upcoming tournaments",
            message: error.message
        });
    }
}

async function getTournamentsPerPage(req, res) {
    try {
        const { startIndex, endIndex, searchTerm } = req.query; // Utilisez req.query pour récupérer les paramètres de la requête
        // Continuez avec le reste de votre logique...
        const tournaments = await tournamentService.getTournamentsPerPage(startIndex, endIndex, searchTerm);
        return res.status(200).json(tournaments);
    } catch (error) {
        return res.status(500).json({
            error: "Error getting tournaments",
            message: error.message
        });
    }
}

async function getUpcomingTournamentsPage(req, res) {
    try {
        const { startIndex, endIndex, searchTerm } = req.query;
        const { totalCount, tournaments } = await tournamentService.getUpcomingTournamentsPage(startIndex, endIndex, searchTerm);
        return res.status(200).json({ totalCount, tournaments });
    } catch (error) {
        return res.status(500).json({
            error: "Error getting tournaments",
            message: error.message
        });
    }
}

module.exports = {
    getNumberOfUpcomingTournaments,
    getTournamentsPerPage,
    getUpcomingTournamentsPage
};
