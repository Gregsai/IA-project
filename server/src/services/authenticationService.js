const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const pool = require("../../config/database");

async function signUp(firstName, lastName, email, password) {
  try {
    console.log("signUpUser", firstName, lastName, email, password);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(
      firstName,
      lastName,
      email,
      hashedPassword,
      false,
      "user"
    );

    const queryText =
      "INSERT INTO users (firstName, lastName, email, password, confirmed, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING email";
    const values = [
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.password,
      newUser.confirmed,
      newUser.role,
    ];

    const result = await pool.query(queryText, values);
    const insertedEmail = result.rows[0].email;

    return insertedEmail;
  } catch (error) {
    console.error("Error during registration :", error);
    throw new Error("Error during registration.");
  }
}

async function emailAlreadyExists(email) {
  try {
    const queryText = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await pool.query(queryText, values);
    const user = result.rows[0];

    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during email existence checking :", error);
    throw new Error("Error during email existence checking.");
  }
}

async function sendConfirmationEmail(email) {
  try {
    const confirmationToken = jwt.sign({ email }, "secret", {
      expiresIn: "24h",
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "internetapplication7@gmail.com",
        pass: "simz hxia qtur oayu",
      },
    });

    const mailOptions = {
      from: "internetapplication7@gmail.com",
      to: email,
      subject: "IA Project Account verification",
      html: `
      <p>
        Click the button below to verify your account:
      </p>
      <a href="http://localhost:4200/verify-account/${confirmationToken}" style="text-decoration: none;">
        <button style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Verify Account
        </button>
      </a>
    `,
    };
    await transporter.sendMail(mailOptions);
    return { message: "Confirmation email sent. Please check your inbox" };
  } catch (error) {
    console.error("Error sending confirmation email :", error);
    throw new Error("Error sending confirmation email.");
  }
}

async function verifyAccount(token) {
  try {
    const decoded = jwt.verify(token, "secret");
    const email = decoded.email;

    const confirmUserQuery = "UPDATE users SET confirmed = $1 WHERE email = $2";
    const values = [true, email];

    await pool.query(confirmUserQuery, values);

    return {
      message:
        "Account successfully activated. You will now be redirected to the main page.",
    };
  } catch (error) {
    console.error("Error occured during activation process :", error);
    throw new Error("Error occured during activation process.");
  }
}

async function emailVerified(email) {
  try {
    const queryText = "SELECT * FROM users WHERE email = $1 ";
    const values = [email];

    const result = await pool.query(queryText, values);
    const user = result.rows[0];

    if (user.confirmed) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during email verification :", error);
    throw new Error("Error during email verification.");
  }
}

async function signIn(email, password) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    const { token, expirationDate } = await generateSignedInToken(user.email);

    return { token, expirationDate };
  } catch (error) {
    console.error("Error during sign in:", error);
    throw new Error("Error during sign in");
  }
}

async function getUserByEmail(email) {
  try {
    const queryText = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await pool.query(queryText, values);
    const user = result.rows[0];

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Error fetching user by email");
  }
}

async function getUserIdByEmail(email) {
  try {
    const queryText = "SELECT id FROM users WHERE email = $1";
    const values = [email];

    const result = await pool.query(queryText, values);
    const id = result.rows[0]['id'];

    if (!id) {
      throw new Error("User not found");
    }
    return id;
  } catch (error) {
    console.error("Error fetching user id by email:", error);
    throw new Error("Error fetching user id by email");
  }
}

async function getUserRoleById(id) {
  try {
    const queryText = "SELECT role FROM users WHERE id = $1";
    const values = [id];

    const result = await pool.query(queryText, values);
    const role = result.rows[0];

    if (!role) {
      throw new Error("User not found");
    }

    return role;
  } catch (error) {
    console.error("Error fetching user role by id:", error);
    throw new Error("Error fetching user role by id");
  }
}

async function comparePasswords(password, hashedPassword) {
  try {
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    return passwordMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
}

async function generateSignedInToken(email) {
  try {
    const id = await getUserIdByEmail(email);
    const role = await getUserRoleById(id);
    const token = jwt.sign({ id, role }, "secret", { expiresIn: "1h" });
    const decodedToken = jwt.decode(token);
    const expirationDate = new Date(decodedToken.exp * 1000); // Convertir en millisecondes

    return { token, expirationDate };
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Error generating token");
  }
}

module.exports = {
  signUp,
  signIn,
  emailAlreadyExists,
  sendConfirmationEmail,
  verifyAccount,
  emailVerified,
  getUserByEmail,
  comparePasswords,
  generateSignedInToken,
  getUserIdByEmail,
  getUserRoleById,
};
