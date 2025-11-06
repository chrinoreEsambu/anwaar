const userRepository = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
require("dotenv").config();

class UserService {
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
      { expiresIn: "5h" }
    );

    delete user.password;
    return {
      user,
      token,
    };
  }

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

  async userUpdate(
    oldEmail,
    name,
    first_name,
    newEmail,
    password,
    birthdate,
    gender,
    role
  ) {
    const find = await userRepository.findByEmail(oldEmail);
    if (!find) {
      throw new Error("Aucun utilisateur trouvé");
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (first_name) updateData.first_name = first_name;
    if (newEmail) updateData.email = newEmail.toLowerCase();
    if (password) {
      updateData.password = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 15,
        timeCost: 3,
        hashLength: 50,
        parallelism: 2,
      });
    }
    if (birthdate) updateData.birthdate = new Date(birthdate);
    if (gender) updateData.gender = gender;
    if (role) updateData.role = role;

    const updatedUser = await userRepository.update(oldEmail, updateData);

    delete updatedUser.password;
    return updatedUser;
  }
}

module.exports = new UserService();
