const tournamentService = require("../services/tournamentService");

async function getNumberOfUpcomingTournaments(req, res) {
    try {
      const result = await tournamentService.getNumberOfUpcomingTournaments();
      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(500).json({ error: result.message });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Error getting number of upcoming tournaments",
        message: error.message
      });
    }
  }

  module.exports = {
    getNumberOfUpcomingTournaments,
  };