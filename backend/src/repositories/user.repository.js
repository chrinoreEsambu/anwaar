const prisma = require("../config/prismaClient");

/**
 * Repository pour les opérations sur les utilisateurs
 * Responsabilité : Accès direct à la base de données via Prisma
 */
class UserRepository {
  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} Utilisateur créé
   */
  async create(userData) {
    return await prisma.users.create({
      data: userData,
    });
  }

  /**
   * Trouver un utilisateur par email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   */
  async findByEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
    });
  }

  /**
   * Trouver un utilisateur par ID
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   */
  async findById(id) {
    return await prisma.users.findUnique({
      where: { id },
    });
  }

  /**
   * Récupérer tous les utilisateurs
   * @param {Object} options - Options de tri et pagination
   * @returns {Promise<Array>} Liste des utilisateurs
   */
  async findAll(options = {}) {
    const { orderBy = { createdAt: "desc" }, skip, take } = options;

    return await prisma.users.findMany({
      orderBy,
      skip,
      take,
    });
  }

  /**
   * Mettre à jour un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @param {Object} userData - Données à mettre à jour
   * @returns {Promise<Object>} Utilisateur mis à jour
   */
  async update(id, userData) {
    return await prisma.users.update({
      where: { id },
      data: userData,
    });
  }

  /**
   * Supprimer un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} Utilisateur supprimé
   */
  async delete(id) {
    return await prisma.users.delete({
      where: { id },
    });
  }

  /**
   * Compter le nombre d'utilisateurs
   * @param {Object} where - Conditions de filtrage
   * @returns {Promise<number>} Nombre d'utilisateurs
   */
  async count(where = {}) {
    return await prisma.users.count({ where });
  }

  /**
   * Trouver des utilisateurs avec pagination
   * @param {number} page - Numéro de page
   * @param {number} limit - Nombre d'éléments par page
   * @returns {Promise<Object>} Utilisateurs et métadonnées de pagination
   */
  async findWithPagination(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.findAll({ skip, take: limit }),
      this.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new UserRepository();
