const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "IA",
  password: "greg",
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL :', err);
  } else {
    console.log('Connexion à PostgreSQL établie le :', res.rows[0].now);
  }
});

app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Cet e-mail est déjà utilisé.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = jwt.sign({ email }, 'votre_secret', { expiresIn: '24h' });
    await pool.query(
      'INSERT INTO users (name, surname, email, password, confirmation_token, confirmed) VALUES ($1, $2, $3, $4, $5, $6)',
      [firstName, lastName, email, hashedPassword, confirmationToken, false]
    );
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'internetapplication7@gmail.com',
        pass: 'simz hxia qtur oayu',
      },
    });
    const mailOptions = {
      from: 'internetapplication7@gmail.com',
      to: email,
      subject: 'Confirmation d\'inscription',
      html: `<p>Cliquez sur <a href="http://localhost:3000/confirm/${confirmationToken}">ce lien</a> pour confirmer votre compte.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Inscription réussie. Vérifiez votre e-mail pour la confirmation.' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
  }
});

app.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, 'votre_secret');

    await pool.query('UPDATE users SET confirmed = $1 WHERE email = $2', [true, decoded.email]);

    res.status(200).send('Compte confirmé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la confirmation du compte :', error);
    res.status(500).send('Erreur lors de la confirmation du compte.');
  }
});

app.get('/logout', (req, res) => {
  // Vous pouvez implémenter ici la logique de déconnexion, telle que la suppression du jeton JWT, etc.
  // Exemple simple : vider le cookie JWT
  res.clearCookie('jwtToken'); // Assurez-vous d'utiliser le nom correct du cookie
  res.status(200).json({ message: 'Vous êtes déconnecté.' });
});

// Route pour réinitialiser le mot de passe oublié
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Vérification si l'e-mail existe dans la base de données
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet e-mail.' });
    }

    const resetToken = jwt.sign({ email }, 'votre_secret', { expiresIn: '1h' }); // Token de réinitialisation expirant en 1 heure

    await pool.query('UPDATE users SET reset_token = $1 WHERE email = $2', [resetToken, email]);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'internetapplication7@gmail.com',
        pass: 'simz hxia qtur oayu',
      },
    });

    const mailOptions = {
      from: 'internetapplication7@gmail.com',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: `<p>Pour réinitialiser votre mot de passe, cliquez sur <a href="http://localhost:3000/reset-password/${resetToken}">ce lien</a>.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Instructions pour réinitialiser le mot de passe envoyées par e-mail.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification si l'utilisateur existe dans la base de données
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Adresse e-mail ou mot de passe incorrect.' });
    }

    const storedHashedPassword = user.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Adresse e-mail ou mot de passe incorrect.' });
    }

    // Générer le token JWT pour l'authentification
    const accessToken = jwt.sign({ email }, 'votre_secret', { expiresIn: '24h' });

    // Vous pouvez stocker le token JWT dans un cookie ou le renvoyer en tant que réponse JSON selon vos besoins
    res.cookie('jwtToken', accessToken, { httpOnly: true }); // Stockage du token dans un cookie sécurisé (optionnel)
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
