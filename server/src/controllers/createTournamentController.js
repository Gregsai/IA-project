const createTournamentService = require("../services/createTournamentService");
const authenticationService = require("../services/authenticationService");

async function createTournament(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(500).json({ error: 'Impossible to identify the user' });
    }
    const organizer = await authenticationService.getUserIdInToken(token);
    const {
      name,
      discipline,
      date,
      maxParticipants,
      applicationDeadline,
      address,
      seedingType,
      sponsors
    } = req.body;
    try {
      const result = await createTournamentService.createTournament(
        organizer,
        name,
        discipline,
        date,
        maxParticipants,
        applicationDeadline,
        address,
        seedingType,
        sponsors
      );
  
      if (result.success) {
        return res.status(201).json({ message: result.message });
      } else {
        return res.status(500).json({ error: result.message });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Error creating tournament',
        message: error.message
      });
    }
  }


  async function editTournament(req, res){
    
    const token = req.cookies.token;
    if (!token) {
      return res.status(500).json({ error: 'Impossible to identify the user' });
    }
    const organizer = await authenticationService.getUserIdInToken(token);
    const {
      id,
      name,
      discipline,
      date,
      maxParticipants,
      applicationDeadline,
      address,
      seedingType,
      sponsors
    } = req.body;
    try {
      const result = await createTournamentService.editTournament(
        id,
        organizer,
        name,
        discipline,
        date,
        maxParticipants,
        applicationDeadline,
        address,
        seedingType,
        sponsors
      );
  
      if (result.success) {
        return res.status(201).json({ message: result.message });
      } else {
        return res.status(500).json({ error: result.message });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Error editing tournament',
        message: error.message
      });
    }
  }
module.exports = {
  createTournament,
  editTournament,
};
