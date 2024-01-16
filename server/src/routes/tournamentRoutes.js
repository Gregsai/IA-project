const express = require("express");
const TournamentController = require("../controllers/tournamentController");

const router = express.Router();

router.get('/get-tournament-information/:id', TournamentController.getTournamentInformation);
router.get('/get-tournament-sponsors/:id', TournamentController.getTournamentSponsors);
router.get('/get-tournament-participants-list/:id', TournamentController.getTournamentParticipantsList);
router.get('/get-upcoming-tournaments-page', TournamentController.getUpcomingTournamentsPage);
router.get('/is-user-a-participant-of-tournament/:id', TournamentController.isUserAParticipantOfTournament);
router.get('/is-user-organizer-of-tournament/:id', TournamentController.isUserOrganizerOfTournament);

router.post('/participate', TournamentController.participate);
router.post('/getIntoTournament', TournamentController.getIntoTournament);
router.post('/unparticipate', TournamentController.unparticipate);

module.exports = router;
