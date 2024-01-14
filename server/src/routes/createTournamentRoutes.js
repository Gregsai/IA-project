const express = require("express");
const createTournamentController = require("../controllers/createTournamentController");

const router = express.Router();

router.post('/create-tournament', createTournamentController.createTournament);
router.post('/edit-tournament', createTournamentController.editTournament);


module.exports = router;
