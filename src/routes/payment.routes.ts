import { Router } from 'express';
import {
  createPaymentIntent,
  getPaymentIntent,
  confirmPayment,
  cancelPayment,
  handleWebhook,
} from '../controllers/payment.controller';
import {
  validateCreatePaymentIntent,
  validatePaymentIntentId,
  validateConfirmPayment,
} from '../middleware/validation';

const router = Router();

// Route pour créer un Payment Intent
router.post('/payment-intents', validateCreatePaymentIntent, createPaymentIntent);

// Route pour récupérer un Payment Intent
router.get('/payment-intents/:paymentIntentId', validatePaymentIntentId, getPaymentIntent);

// Route pour confirmer un paiement
router.post('/payment-intents/:paymentIntentId/confirm', validateConfirmPayment, confirmPayment);

// Route pour annuler un paiement
router.post('/payment-intents/:paymentIntentId/cancel', validatePaymentIntentId, cancelPayment);

// Route pour les webhooks Stripe
router.post('/webhooks', handleWebhook);

export default router; 