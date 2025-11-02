/**
 * @typedef {Object} CreateUserDTO
 * @property {string} name - Nom de l'utilisateur
 * @property {string} first_name - Prénom de l'utilisateur
 * @property {string} email - Email unique de l'utilisateur
 * @property {Date} birthdate - Date de naissance
 * @property {string} gender - Genre (homme/femme/autre)
 * @property {'admin'|'client'} [role] - Rôle de l'utilisateur (optionnel, par défaut 'client')
 */

/**
 * @typedef {Object} UpdateUserDTO
 * @property {string} [name] - Nom de l'utilisateur
 * @property {string} [first_name] - Prénom de l'utilisateur
 * @property {string} [email] - Email de l'utilisateur
 * @property {Date} [birthdate] - Date de naissance
 * @property {string} [gender] - Genre
 */

/**
 * @typedef {Object} UserResponse
 * @property {string} id - ID de l'utilisateur
 * @property {string} name - Nom
 * @property {string} first_name - Prénom
 * @property {string} email - Email
 * @property {Date} birthdate - Date de naissance
 * @property {string} gender - Genre
 * @property {string} role - Rôle
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de mise à jour
 */

/**
 * @typedef {Object} LoginDTO
 * @property {string} email - Email de l'utilisateur
 * @property {string} password - Mot de passe
 */

module.exports = {};
