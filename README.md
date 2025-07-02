# Service de Paiement

Service de paiement microservice utilisant TypeScript et Stripe pour gérer les transactions de paiement.

## 🚀 Fonctionnalités

- Création de Payment Intents Stripe
- Confirmation de paiements
- Annulation de paiements
- Gestion des webhooks Stripe
- Validation des données avec Joi
- Logging avec Winston
- Rate limiting
- Sécurité avec Helmet
- CORS configuré

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Compte Stripe (clés API)

## 🛠️ Installation

1. Cloner le repository
2. Installer les dépendances :
```bash
npm install
```

3. Copier le fichier d'environnement :
```bash
cp env.example .env
```

4. Configurer les variables d'environnement dans `.env` :
```env
PORT=3004
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
CORS_ORIGIN=http://localhost:3000
```

## 🏃‍♂️ Démarrage

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3004
```

### Endpoints

#### 1. Créer un Payment Intent
```http
POST /api/payments/payment-intents
Content-Type: application/json

{
  "amount": 2000,
  "currency": "eur",
  "payment_method_types": ["card"],
  "description": "Paiement pour service",
  "metadata": {
    "order_id": "12345"
  }
}
```

#### 2. Récupérer un Payment Intent
```http
GET /api/payments/payment-intents/:paymentIntentId
```

#### 3. Confirmer un paiement
```http
POST /api/payments/payment-intents/:paymentIntentId/confirm
Content-Type: application/json

{
  "paymentMethodId": "pm_1234567890"
}
```

#### 4. Annuler un paiement
```http
POST /api/payments/payment-intents/:paymentIntentId/cancel
```

#### 5. Webhook Stripe
```http
POST /api/payments/webhooks
```

#### 6. Santé du service
```http
GET /health
```

## 🔧 Configuration Stripe

### 1. Obtenir les clés API
1. Créer un compte sur [Stripe](https://stripe.com)
2. Aller dans le Dashboard > Developers > API keys
3. Copier les clés publiques et secrètes

### 2. Configurer les webhooks
1. Dans le Dashboard Stripe > Developers > Webhooks
2. Ajouter un endpoint : `http://localhost:3004/api/payments/webhooks`
3. Sélectionner les événements :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copier le secret du webhook

## 📝 Structure du projet

```
src/
├── config/
│   ├── env.ts          # Configuration des variables d'environnement
│   └── logger.ts       # Configuration des logs
├── controllers/
│   └── payment.controller.ts  # Contrôleurs pour les routes
├── middleware/
│   └── validation.ts   # Middleware de validation
├── routes/
│   └── payment.routes.ts      # Définition des routes
├── services/
│   └── stripe.service.ts      # Service Stripe
├── types/
│   └── payment.ts      # Types TypeScript
└── index.ts            # Point d'entrée de l'application
```

## 🧪 Tests

```bash
npm test
```

## 📊 Logs

Les logs sont configurés avec Winston et sont disponibles dans :
- `logs/error.log` : Erreurs uniquement
- `logs/combined.log` : Tous les logs

## 🔒 Sécurité

- **Helmet** : Headers de sécurité HTTP
- **CORS** : Configuration des origines autorisées
- **Rate Limiting** : Limitation du nombre de requêtes
- **Validation** : Validation des données avec Joi
- **Logging** : Logs sécurisés sans données sensibles

## 🚨 Gestion d'erreurs

Le service retourne des réponses d'erreur standardisées :

```json
{
  "success": false,
  "error": {
    "message": "Description de l'erreur",
    "code": "CODE_ERREUR",
    "statusCode": 400
  }
}
```

## 🔄 Intégration avec d'autres services

Ce service peut être intégré avec :
- Le service d'authentification pour vérifier les utilisateurs
- Le service de base de données pour stocker les transactions
- Le service de notifications pour informer des paiements

## 📈 Monitoring

Le service expose un endpoint `/health` pour vérifier son état de santé.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT 