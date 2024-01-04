const express = require("express");
const cors = require("cors");
const authenticationRoutes = require("./routes/authenticationRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());

app.use('/authentication', authenticationRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
