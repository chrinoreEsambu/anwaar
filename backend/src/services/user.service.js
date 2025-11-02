const userRepository = require("../repositories/user.repository");
const argon2 = require("argon2");

class UserService {
  async createUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    if (!this.isValidEmail(userData.email)) {
      throw new Error("Format d'email invalide");
    }

    const hashedPassword = await argon2.hash(userData.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 15,
      timeCost: 3,
      hashLength: 50,
      parallelism: 2,
    });

    const newUser = await userRepository.create({
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

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = new UserService();
