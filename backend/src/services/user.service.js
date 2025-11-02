const argon2 = require("argon2");
const userRepository = require("../repositories/user.repository");

/**
 * Service pour la logique métier des utilisateurs
 * Responsabilité : Règles de gestion, validation métier, orchestration
 */
class UserService {
  /**
   * Créer un nouvel utilisateur
   * @param {CreateUserDTO} userData - Données de l'utilisateur
   * @returns {Promise<Object>} Utilisateur créé (sans le mot de passe)
   * @throws {Error} Si l'email existe déjà
   */
  async createUser(userData) {
    // Vérifier si l'email existe déjà
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Valider le format de l'email
    if (!this.isValidEmail(userData.email)) {
      throw new Error("Format d'email invalide");
    }

    // Valider la date de naissance (doit avoir au moins 13 ans)
    if (!this.isValidAge(userData.birthdate)) {
      throw new Error("L'utilisateur doit avoir au moins 13 ans");
    }

    // Créer l'utilisateur
    const newUser = await userRepository.create({
      name: userData.name,
      first_name: userData.first_name,
      email: userData.email.toLowerCase(),
      birthdate: new Date(userData.birthdate),
      gender: userData.gender,
      role: userData.role || "client",
    });

    // Retourner l'utilisateur sans informations sensibles
    return this.sanitizeUser(newUser);
  }

  /**
   * Récupérer tous les utilisateurs (admin seulement)
   * @param {number} page - Numéro de page
   * @param {number} limit - Nombre d'éléments par page
   * @returns {Promise<Object>} Liste des utilisateurs avec pagination
   */
  async getAllUsers(page = 1, limit = 10) {
    const result = await userRepository.findWithPagination(page, limit);

    return {
      users: result.users.map((user) => this.sanitizeUser(user)),
      pagination: result.pagination,
    };
  }

  /**
   * Récupérer un utilisateur par ID
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} Utilisateur trouvé
   * @throws {Error} Si l'utilisateur n'existe pas
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return this.sanitizeUser(user);
  }

  /**
   * Mettre à jour un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @param {UpdateUserDTO} userData - Données à mettre à jour
   * @returns {Promise<Object>} Utilisateur mis à jour
   * @throws {Error} Si l'utilisateur n'existe pas ou si l'email est déjà utilisé
   */
  async updateUser(id, userData) {
    // Vérifier si l'utilisateur existe
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error("Utilisateur non trouvé");
    }

    // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await userRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new Error("Cet email est déjà utilisé");
      }

      // Valider le format
      if (!this.isValidEmail(userData.email)) {
        throw new Error("Format d'email invalide");
      }

      userData.email = userData.email.toLowerCase();
    }

    // Valider la date de naissance si modifiée
    if (userData.birthdate && !this.isValidAge(userData.birthdate)) {
      throw new Error("L'utilisateur doit avoir au moins 13 ans");
    }

    // Mettre à jour
    const updatedUser = await userRepository.update(id, userData);

    return this.sanitizeUser(updatedUser);
  }

  /**
   * Supprimer un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} Utilisateur supprimé
   * @throws {Error} Si l'utilisateur n'existe pas
   */
  async deleteUser(id) {
    // Vérifier si l'utilisateur existe
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error("Utilisateur non trouvé");
    }

    const deletedUser = await userRepository.delete(id);

    return this.sanitizeUser(deletedUser);
  }

  /**
   * Obtenir des statistiques sur les utilisateurs
   * @returns {Promise<Object>} Statistiques
   */
  async getUserStats() {
    const [totalUsers, totalAdmins, totalClients] = await Promise.all([
      userRepository.count(),
      userRepository.count({ role: "admin" }),
      userRepository.count({ role: "client" }),
    ]);

    return {
      totalUsers,
      totalAdmins,
      totalClients,
    };
  }

  // ========== MÉTHODES UTILITAIRES ==========

  /**
   * Nettoyer les données sensibles de l'utilisateur
   * @private
   */
  sanitizeUser(user) {
    const { ...sanitized } = user;
    return sanitized;
  }

  /**
   * Valider le format d'un email
   * @private
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valider l'âge minimum (13 ans)
   * @private
   */
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
