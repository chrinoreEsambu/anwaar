const userRepository = require("../repositories/user.repository");
const argon2 = require("argon2");

class UserService {
  async createUser(userData) {
    // Vérifier si l'email existe déjà
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Valider l'email
    if (!this.isValidEmail(userData.email)) {
      throw new Error("Format d'email invalide");
    }

    // Valider l'âge
    if (!this.isValidAge(userData.birthdate)) {
      throw new Error("L'utilisateur doit avoir au moins 13 ans");
    }

    // Hasher le password ICI ✅
    const hashedPassword = await argon2.hash(userData.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 12,
      timeCost: 2,
      hashLength: 50,
      parallelism: 3,
    });

    // Créer l'utilisateur
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

  isValidAge(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1 >= 13;
    }

    return age >= 13;
  }
}

module.exports = new UserService();
