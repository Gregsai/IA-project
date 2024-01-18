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

async function getIntoTournament(req, res) {
    try {
        const { id, licenceNumber, ranking} = req.body;

        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }

        const userId = await authenticationService.getUserIdInToken(token);
        

        const participationMessage = await tournamentService.getIntoTournament(id, userId, licenceNumber, ranking);

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

async function getUserTournamentsPage(req, res) {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }

        const userId = await authenticationService.getUserIdInToken(token);
        
        const { startIndex, endIndex, searchTerm } = req.query;
        const { totalCount, tournaments } = await tournamentService.getUserTournamentsPage(startIndex, endIndex, searchTerm, userId);
        return res.status(200).json({ totalCount, tournaments });
    } catch (error) {
        return res.status(500).json({
            error: "Error getting tournaments",
            message: error.message
        });
    }
}

async function getEnrolledInTournamentsPage(req, res) {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }

        const userId = await authenticationService.getUserIdInToken(token);
        
        const { startIndex, endIndex, searchTerm } = req.query;
        const { totalCount, tournaments } = await tournamentService.getEnrolledInTournamentsPage(startIndex, endIndex, searchTerm, userId);
        return res.status(200).json({ totalCount, tournaments });
    } catch (error) {
        return res.status(500).json({
            error: "Error getting tournaments",
            message: error.message
        });
    }
}

async function getTournamentLadder(req, res){
    try {
        const { id } = req.params;
        const { ladder } = await tournamentService.getTournamentLadder(id);
        return res.status(200).json(ladder);
    } catch (error) {
        return res.status(500).json({
            error: "Error getting ladder",
            message: error.message
        });
    }
}

async function getTournamentTree(req, res){
    try {
        const { id } = req.params;
        const { tree } = await tournamentService.getTournamentTree(id);
        return res.status(200).json(tree);
    } catch (error) {
        return res.status(500).json({
            error: "Error getting tree",
            message: error.message
        });
    }
}

async function getUserMatches(req, res){
    try {
        const { id } = req.params;
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }
    
        const userId = await authenticationService.getUserIdInToken(token);
        
        const {userMatches, userParticipantId} = await tournamentService.getUserMatches(id, userId);
        return res.status(200).json({ userMatches, userParticipantId });
    } catch (error) {
        return res.status(500).json({
            error: "Error getting user matches",
            message: error.message
        });
    }
}

async function selectWinner(req, res) {
    try {
        const { participantId, matchId, userParticipantId } = req.body;

        const token = req.cookies.token;
        
        if (!token) {
            return res.status(500).json({ error: 'Impossible to identify the user' });
        }

        const result = await tournamentService.selectWinner(participantId, matchId, userParticipantId);
        return res.status(200).json({ message:"successfully manage vote"});

    } catch (error) {
        return res.status(500).json({
            error: "Error voting match result",
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
    getIntoTournament,
    getUserTournamentsPage,
    getEnrolledInTournamentsPage,
    getTournamentLadder,
    getUserMatches,
    getTournamentTree,
    selectWinner
};