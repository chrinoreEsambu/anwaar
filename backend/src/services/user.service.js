const userRepository = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
require("dotenv").config();

class UserService {
  async createUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }
    const hashedPassword = await argon2.hash(userData.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 15,
      timeCost: 3,
      hashLength: 50,
      parallelism: 2,
    });

    const newUser = await userRepository.createUser({
      name: userData.name,
      first_name: userData.first_name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      birthdate: new Date(userData.birthdate),
      gender: userData.gender,
      role: userData.role || "client",
    });

    return newUser;
  }

  async getAll(jump) {
    const alluser = await userRepository.findAll(jump);
    if (alluser.length <= 0) {
      return "No users found";
    }
    return alluser;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    delete user.password;
    return {
      user,
      token,
    };
  }
}

module.exports = new UserService();
