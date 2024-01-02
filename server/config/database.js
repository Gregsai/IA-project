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

module.exports = pool;
