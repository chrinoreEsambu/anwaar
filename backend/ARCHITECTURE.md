# 🏗️ Architecture en Couches - Guide Complet

## 📚 Vue d'ensemble

Ce projet utilise une **architecture en couches** (Layered Architecture) qui sépare les responsabilités en différentes couches pour un code plus maintenable, testable et évolutif.

## 🔄 Flux de données

```
Client Request
     ↓
┌────────────────┐
│    ROUTES      │  → Définit les endpoints HTTP
└────────┬───────┘
         ↓
┌────────────────┐
│  MIDDLEWARES   │  → Authentification, Validation, etc.
└────────┬───────┘
         ↓
┌────────────────┐
│  CONTROLLERS   │  → Gère les requêtes/réponses HTTP
└────────┬───────┘
         ↓
┌────────────────┐
│   SERVICES     │  → Logique métier
└────────┬───────┘
         ↓
┌────────────────┐
│  REPOSITORIES  │  → Accès aux données (Prisma)
└────────┬───────┘
         ↓
    DATABASE
```

## 📂 Structure des dossiers

```
backend/
├── src/
│   ├── config/           # Configuration (DB, env, etc.)
│   ├── types/            # Définitions TypeScript/JSDoc
│   ├── repositories/     # Accès aux données
│   ├── services/         # Logique métier
│   ├── controllers/      # Gestion HTTP
│   ├── middlewares/      # Middlewares Express
│   ├── routes/           # Définition des routes
│   └── prisma/           # Schéma Prisma et migrations
```

## 🎯 Responsabilités de chaque couche

### 1️⃣ **TYPES** (`types/`)

**Rôle** : Définir les structures de données et les contrats

**Responsabilités** :

- Définitions TypeScript/JSDoc
- DTOs (Data Transfer Objects)
- Types de requête/réponse
- Validation de structure

**Exemple** :

```javascript
/**
 * @typedef {Object} CreateUserDTO
 * @property {string} name
 * @property {string} email
 */
```

---

### 2️⃣ **REPOSITORIES** (`repositories/`)

**Rôle** : Accès direct à la base de données

**Responsabilités** :

- ✅ Requêtes Prisma (CRUD de base)
- ✅ Accès aux données brutes
- ✅ Méthodes simples (findById, create, update, delete)
- ❌ PAS de logique métier
- ❌ PAS de validation complexe

**Exemple** :

```javascript
class UserRepository {
  async findByEmail(email) {
    return await prisma.users.findUnique({ where: { email } });
  }

  async create(userData) {
    return await prisma.users.create({ data: userData });
  }
}
```

**Quand utiliser** :

- Créer/Lire/Modifier/Supprimer des données
- Requêtes simples sans logique

---

### 3️⃣ **SERVICES** (`services/`)

**Rôle** : Logique métier et orchestration

**Responsabilités** :

- ✅ Règles de gestion métier
- ✅ Validation métier (âge, format, etc.)
- ✅ Orchestration de plusieurs repositories
- ✅ Transformation des données
- ✅ Gestion des erreurs métier
- ❌ PAS de gestion HTTP directe
- ❌ PAS d'accès direct à req/res

**Exemple** :

```javascript
class UserService {
  async createUser(userData) {
    // Vérifier si l'email existe
    const exists = await userRepository.findByEmail(userData.email);
    if (exists) {
      throw new Error("Email déjà utilisé");
    }

    // Valider l'âge
    if (!this.isValidAge(userData.birthdate)) {
      throw new Error("Doit avoir au moins 13 ans");
    }

    // Créer l'utilisateur
    return await userRepository.create(userData);
  }
}
```

**Quand utiliser** :

- Appliquer des règles métier
- Valider des données complexes
- Coordonner plusieurs opérations

---

### 4️⃣ **CONTROLLERS** (`controllers/`)

**Rôle** : Gérer les requêtes/réponses HTTP

**Responsabilités** :

- ✅ Extraire les données de la requête (req.body, req.params)
- ✅ Valider la présence des champs requis
- ✅ Appeler les services appropriés
- ✅ Formatter les réponses HTTP
- ✅ Gérer les codes de statut HTTP
- ❌ PAS de logique métier
- ❌ PAS d'accès direct à Prisma

**Exemple** :

```javascript
class UserController {
  async createUser(req, res) {
    try {
      const { name, email } = req.body;

      // Validation des champs requis
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Champs requis manquants",
        });
      }

      // Appeler le service
      const user = await userService.createUser({ name, email });

      // Retourner la réponse
      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
```

**Quand utiliser** :

- Gérer une requête HTTP
- Valider les entrées utilisateur
- Formatter les réponses

---

### 5️⃣ **MIDDLEWARES** (`middlewares/`)

**Rôle** : Intercepter et traiter les requêtes

**Responsabilités** :

- ✅ Authentification (vérifier token)
- ✅ Autorisation (vérifier rôles)
- ✅ Validation des données (schémas)
- ✅ Rate limiting
- ✅ Logging

**Exemple** :

```javascript
const authMiddleware = (req, res, next) => {
  if (!req.session?.user_id) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  next();
};
```

---

### 6️⃣ **ROUTES** (`routes/`)

**Rôle** : Définir les endpoints de l'API

**Responsabilités** :

- ✅ Mapper les URLs aux controllers
- ✅ Appliquer les middlewares
- ✅ Définir les méthodes HTTP

**Exemple** :

```javascript
router.post("/users", userController.createUser);
router.get("/users/:id", authMiddleware, userController.getUserById);
```

---

## 🔐 Exemple Complet : Création d'utilisateur

### 1. Client fait une requête

```http
POST /api/users
Content-Type: application/json

{
  "name": "Dupont",
  "email": "dupont@example.com"
}
```

### 2. Route capture la requête

```javascript
// routes/user.routes.js
router.post("/users", userController.createUser);
```

### 3. Controller traite la requête HTTP

```javascript
// controllers/user.controller.js
async createUser(req, res) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  const user = await userService.createUser({ name, email });

  return res.status(201).json({ data: user });
}
```

### 4. Service applique la logique métier

```javascript
// services/user.service.js
async createUser(userData) {
  // Vérifier si l'email existe
  const exists = await userRepository.findByEmail(userData.email);
  if (exists) throw new Error("Email existe");

  // Créer l'utilisateur
  return await userRepository.create(userData);
}
```

### 5. Repository accède à la DB

```javascript
// repositories/user.repository.js
async create(userData) {
  return await prisma.users.create({ data: userData });
}
```

---

## ✅ Avantages de cette architecture

1. **Séparation des responsabilités** : Chaque couche a un rôle clair
2. **Testabilité** : Chaque couche peut être testée indépendamment
3. **Maintenabilité** : Code organisé et facile à modifier
4. **Réutilisabilité** : Les services peuvent être utilisés par plusieurs controllers
5. **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités

---

## 🎓 Règles d'or

1. **Un controller appelle un service, jamais Prisma directement**
2. **Un service appelle un repository, jamais Prisma directement**
3. **Un repository utilise uniquement Prisma**
4. **La logique métier va dans le service**
5. **La validation HTTP va dans le controller**
6. **Les requêtes DB vont dans le repository**

---

## 🚀 Prochaines étapes

1. ✅ Créer les repositories pour les autres entités
2. ✅ Créer les services avec la logique métier
3. ✅ Créer les controllers pour gérer les requêtes
4. ✅ Créer les routes pour exposer l'API
5. ✅ Ajouter les middlewares (auth, validation)
6. ✅ Tester chaque couche

---

**Bonne chance ! 🎉**
