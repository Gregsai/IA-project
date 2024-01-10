const express = require("express");
const createTournamentController = require("../controllers/createTournamentController");

const router = express.Router();

router.post('/create-tournament', createTournamentController.createTournament);


module.exports = router;
