const express = require("express");
const TournamentController = require("../controllers/tournamentController");

const router = express.Router();

router.get('/get-number-of-upcoming-tournaments', TournamentController.getNumberOfUpcomingTournaments);


module.exports = router;
