const userRepository = require("../repositories/user.repository");

class UserService {
  async createUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    if (!this.isValidEmail(userData.email)) {
      throw new Error("Format d'email invalide");
    }

    if (!this.isValidAge(userData.birthdate)) {
      throw new Error("L'utilisateur doit avoir au moins 13 ans");
    }

    const newUser = await userRepository.create({
      name: userData.name,
      first_name: userData.first_name,
      email: userData.email.toLowerCase(),
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
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 13;
    }
    
    return age >= 13;
  }
}

module.exports = new UserService();
