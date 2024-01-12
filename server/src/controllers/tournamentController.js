const tournamentService = require("../services/tournamentService");

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
async function getTournamentInformation(req, res) {
    try {
        const { id } = req.params;
        const tournamentInformation = await tournamentService.getTournamentInformation(id);
        return res.status(200).json(tournamentInformation);
    } catch (error) {
        return res.status(500).json({
            error: "Error getting tournament information",
            message: error.message
        });
    }
}

async function getTournamentSponsors(req, res) {
    try {
        const { id } = req.params;
        const tournamentSponsors = await tournamentService.getTournamentSponsors(id);
        return res.status(200).json(tournamentSponsors);
    } catch (error) {
        return res.status(500).json({
            error: "Error getting tournament sponsors",
            message: error.message
        });
    }
}

async function getTournamentParticipantsList(req, res) {
    try {
        const { id } = req.params;
        const participantsList = await tournamentService.getTournamentParticipantsList(id);
        return res.status(200).json(participantsList);
    } catch (error) {
        return res.status(500).json({
            error: "Error getting tournament participants list",
            message: error.message
        });
    }
}

module.exports = {
    getUpcomingTournamentsPage,
    getTournamentInformation,
    getTournamentSponsors,
    getTournamentParticipantsList,
};