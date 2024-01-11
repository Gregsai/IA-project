const express = require("express");
const TournamentController = require("../controllers/tournamentController");

const router = express.Router();

router.get('/get-number-of-upcoming-tournaments', TournamentController.getNumberOfUpcomingTournaments);
router.get('/get-tournaments-page', TournamentController.getTournamentsPerPage);
router.get('/get-upcoming-tournaments-page', TournamentController.getUpcomingTournamentsPage);




module.exports = router;
