const createTournamentService = require("../services/createTournamentService");
const authenticationService = require("../services/authenticationService");

async function createTournament(req, res) {
    console.log("createTournament")
    const token = req.cookies.token;
    const userId = await authenticationService.getUserIdInToken(token);
    console.log('token', token)
    jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          console.error('Erreur de vérification du token :', err.message);
        } else {
          const { id, role } = decoded;
          console.log('ID:', id);
          console.log('Rôle:', role);
          userId = id; // Affecter l'ID à la variable accessible dans la portée extérieure

        }
      });
    const {
      name,
      discipline,
      seedingType,
      dateTime,
      address,
      participantLimit,
      registrationDeadline,
      sponsors
    } = req.body;
    console.log("contenu" , req.body)
    try {
        console.log("a" , req.body)

      const result = await createTournamentService.createTournament(
        userId,
        name,
        discipline,
        seedingType,
        dateTime,
        address,
        participantLimit,
        registrationDeadline,
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


module.exports = {
  createTournament,
};
