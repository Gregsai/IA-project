const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const pool = require("../../config/database");

async function signUp(firstName, lastName, email, password) {
  try {
    console.log("signing up in the authentication service", firstName, lastName, email, password)

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password: ", hashedPassword)
    
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

    console.log("sending query to the database ...")
    const result = await pool.query(queryText, values);
    const insertedEmail = result.rows[0].email;
    console.log("user : " + insertedEmail + " successfully inserted into the database");
    return { message: "User registered successfully" };
  } catch (error) {
    console.error("Error during registration :", error);
    throw new Error("Error during registration.");
  }
}

async function emailAlreadyExists(email) {
  try {
    const queryText = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    console.log("sending query to the database ...")
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

async function emailVerified(email) {
  try {
    const queryText = "SELECT * FROM users WHERE email = $1 ";
    const values = [email];

    console.log("sending query to the database ...")
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

async function sendConfirmationEmail(email) {
  try {
    console.log("Generating confirmation token for email: ", email)
    const confirmationToken = jwt.sign({ email }, "secret", {
      expiresIn: "24h",
    });
    console.log("Confirmation token generated : ", confirmationToken)
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
    console.log("Sending confirmation email ...")
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully")
    return { message: "Confirmation email sent. Please check your inbox" };
  } catch (error) {
    console.error("Error sending confirmation email :", error);
    throw new Error("Error sending confirmation email.");
  }
}

async function verifyAccount(token) {
  try {
    console.log("Verifying token ...", token);
    const decoded = jwt.verify(token, "secret");
    console.log("Token verified :");

    const email = decoded.email;

    const confirmUserQuery = "UPDATE users SET confirmed = $1 WHERE email = $2";
    const values = [true, email];

    console.log("Sending query to confirm user")
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

async function sendResetPasswordEmail(email) {
  try {
    console.log("Generating resetPassword token for email: ", email)
    const resetPasswordToken = jwt.sign({ email }, "secret", {
      expiresIn: "24h",
    });
    console.log("Reset password token generated : ", resetPasswordToken)

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
      subject: "IA Project Reset password",
      html: `
      <p>
        Click the button below to reset your password:
      </p>
      <a href="http://localhost:4200/reset-password/${resetPasswordToken}" style="text-decoration: none;">
        <button style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Reset Password
        </button>
      </a>
    `,
    };
    console.log("Sending reset Password email ...")
    await transporter.sendMail(mailOptions);
    console.log("reset Password email sent successfully")    
    
    return { message: "Reset Password email sent. Please check your inbox" };
  } catch (error) {
    console.error("Error sending Reset Password email :", error);
    throw new Error("Error sending Reset Password email.");
  }
}

async function resetPassword(token, password) {
  try {
    console.log("Verifying token ...", token);
    const decodedToken = jwt.verify(token, "secret");
    console.log("Token verified");

    const email = decodedToken.email;

    console.log("Verifying that the user still exists...");
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    console.log("The user still exists");

    console.log("Hashing the new password : ",password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("New password hashed : ",hashedPassword);

    const queryText = "UPDATE users SET password = $1 WHERE email = $2";
    const values = [hashedPassword, email];

    console.log("Sending query to change the password in the database : ")
    await pool.query(queryText, values);
    console.log("Password changed successfully")

    return { message: "Password reset successful" };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new Error("Error resetting password");
  }
}

async function getUserByEmail(email) {
  try {
    console.log("Getting user by email");
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

async function comparePasswords(password, hashedPassword) {
  try {
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    return passwordMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
}

function generateSignedInToken(user) {
  try {
    const email = user.email;
    const id = user.id;
    const role = user.role;
    const token = jwt.sign({ id, email, role }, "secret", { expiresIn: "1h" });

    return token ;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Error generating token");
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
      return { error: "Password does not match the account" };
    }

    const token = generateSignedInToken(user);

    return { token };
  } catch (error) {
    console.error("Error during sign in:", error);
    throw new Error("Error during sign in");
  }
}



async function checkAndRenewToken(token) {
  try {
    const decoded = jwt.verify(token, "secret");
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    const timeDifference = expirationTime - currentTimestamp;
    console.log("timeDifference: ", timeDifference);
    if (timeDifference > 0) {
      if (timeDifference < 300) { 
        const user = await getUserByEmail(decoded.email);
        const newToken = generateSignedInToken(user);
        return newToken;
      } else {
        return token;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

async function getUserIdInToken(token) {
  try {
    const decoded = jwt.verify(token, "secret");
    const id = decoded.id;
    return id;
  } catch (error) {
    console.error("Error getting user id in token:", error);
    throw new Error("Error getting user id in token");
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
  sendResetPasswordEmail,
  resetPassword,
  checkAndRenewToken,
  getUserIdInToken,
};
