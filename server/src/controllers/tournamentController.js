const tournamentService = require("../services/tournamentService");
const authenticationService = require("../services/authenticationService");
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

async function participate(req, res) {
    try {
        const { id } = req.body;
        console.log("participating on tournament", id)

        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }

        const userId = await authenticationService.getUserIdInToken(token);
        
        const participationMessage = await tournamentService.participate(id, userId);

        if (typeof participationMessage === 'string') {
            return res.status(500).json({
                error: "Error participating in tournament",
                message: participationMessage
            });
        } else {
            return res.status(200).json({
                message: "Successfully participated in tournament"
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: "Error participating in tournament",
            message: error.message
        });
    }
}

async function unparticipate(req, res) {
    try {
        const { id } = req.body;
        console.log("unparticipating on tournament", id)

        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }

        const userId = await authenticationService.getUserIdInToken(token);
        
        await tournamentService.unparticipate(id, userId);
        return res.status(200).json({
            message: "Successfully unparticipated in tournament"
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error unparticipating in tournament",
            message: error.message
        });
    }

}

async function isUserAParticipantOfTournament(req, res){
    try {
        const { id } = req.params;
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }

        const userId = await authenticationService.getUserIdInToken(token);
        
        const isParticipant = await tournamentService.isUserAParticipantOfTournament(id, userId);
        return res.status(200).json({
            isParticipant
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error checking if user is a participant of tournament",
            message: error.message
        });
    }
}

async function isUserOrganizerOfTournament(req, res){
    try {
        const { id } = req.params;
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }

        const userId = await authenticationService.getUserIdInToken(token);
        
        const isOrganizer = await tournamentService.isUserOrganizerOfTournament(id, userId);
        return res.status(200).json({
            isOrganizer
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error checking if user is an organizer of tournament",
            message: error.message
        });
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
};