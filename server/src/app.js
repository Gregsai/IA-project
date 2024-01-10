const express = require("express");
const cors = require("cors");
const authenticationRoutes = require("./routes/authenticationRoutes");
const createTournamentRoutes = require("./routes/createTournamentRoutes");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());

app.use('/authentication', authenticationRoutes);
app.use('/create-tournament', createTournamentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
