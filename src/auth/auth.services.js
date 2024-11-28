let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
let userRepository = require("./auth.repository");

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function register(username, email, password) {
  try {
    // Validasi input
    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length < 3
    ) {
      throw new Error("Username must be at least 3 characters long");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    let user = {
      username,
      email,
      password: hashedPassword,
      role: "USER",
    };

    let newUser = await userRepository.createUser(user);
    return newUser;
  } catch (error) {
    if (error instanceof userRepository.UserExistsError) {
      throw error;
    }
    throw new Error("Registration failed: " + error.message);
  }
}

async function login(username, password) {
  try {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    let user = await userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    let isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid username or password");
    }

    let token = generateToken(user);
    return { user, token };
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
}

module.exports = { register, login };
