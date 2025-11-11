| Fonction                | Description                                     | Côté               |
| ----------------------- | ----------------------------------------------- | ------------------ |
| `register` ok           | Créer un compte (hash avec Argon2, validations) | Backend + Frontend |
| `login` ok              | Connexion avec JWT (ou cookie si tu veux)       | Backend + Frontend |
| `logout` todo Frontend- | Déconnexion (invalider le token côté client)    | Frontend           |
| `getProfile` ok         | Récupérer les infos de l’utilisateur connecté   | Backend            |
| `updateProfile` ok      | Modifier nom, email, etc.                       | Backend + Frontend |
| `deleteAccount` ok      | Supprimer son compte                            | Backend            |
| `getAllUsers` _(admin)_ | Liste des utilisateurs                          | Backend            |

| Fonction              | Description                   | Côté               |
| --------------------- | ----------------------------- | ------------------ |
| `createCategory` ok   | Ajouter une catégorie (admin) | Backend + Frontend |
| `getAllCategories` ok | Voir toutes les catégories    | Backend + Frontend |
| `updateCategory` ok   | Modifier une catégorie        | Backend            |
| `deleteCategory`      | Supprimer une catégorie       | Backend            |

| Fonction           | Description                          | Côté               |
| ------------------ | ------------------------------------ | ------------------ |
| `createProduct`    | Ajouter un produit (admin)           | Backend + Frontend |
| `getAllProducts`   | Liste paginée / filtrée des produits | Backend + Frontend |
| `getProductById`   | Voir les détails d’un produit        | Backend + Frontend |
| `updateProduct`    | Modifier un produit                  | Backend            |
| `deleteProduct`    | Supprimer un produit                 | Backend            |
| `hide` / `display` | Masquer / afficher un produit        | Backend            |

| Fonction            | Description                                            | Côté               |
| ------------------- | ------------------------------------------------------ | ------------------ |
| `createOrder`       | Créer une commande (client connecté ou invité)         | Backend + Frontend |
| `getUserOrders`     | Voir ses propres commandes                             | Backend + Frontend |
| `getOrderById`      | Voir les détails d’une commande                        | Backend + Frontend |
| `updateOrderStatus` | (admin) changer le statut (`pending`, `shipped`, etc.) | Backend            |
| `cancelOrder`       | Annuler une commande                                   | Backend + Frontend |

future emprouvment
| Fonction | Description | Côté |
| --------------------- | ----------------------------------------------------- | ------- |
| `createPayment` | Créer une transaction (à partir d’une commande) | Backend |
| `updatePaymentStatus` | Mettre à jour le statut | Backend |
| `verifyPayment` | Vérifier la validité (si tu utilises une API externe) | Backend |
| `refund` | Remboursement (optionnel, futur) | Backend |
