const express = require("express");
const TournamentController = require("../controllers/tournamentController");

const router = express.Router();

router.get('/get-tournament-information/:id', TournamentController.getTournamentInformation);
router.get('/get-tournament-sponsors/:id', TournamentController.getTournamentSponsors);
router.get('/get-tournament-participants-list/:id', TournamentController.getTournamentParticipantsList);
router.get('/get-upcoming-tournaments-page', TournamentController.getUpcomingTournamentsPage);

module.exports = router;
