import Stripe from 'stripe';
import config from '../config/env';
import logger from '../config/logger';
import { 
  PaymentIntent, 
  CreatePaymentIntentRequest, 
  PaymentResponse, 
  PaymentError 
} from '../types/payment';

class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: request.amount,
        currency: request.currency,
        payment_method_types: request.payment_method_types,
        metadata: request.metadata,
        description: request.description,
      });

      logger.info('Payment intent created successfully', { 
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount 
      });

      return {
        success: true,
        data: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret!,
          created: paymentIntent.created,
        },
      };
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Error creating payment intent', { 
        error: stripeError.message,
        code: stripeError.code 
      });

      const paymentError: PaymentError = {
        message: stripeError.message,
        code: stripeError.code,
        statusCode: stripeError.statusCode || 500,
      };

      return {
        success: false,
        error: paymentError,
      };
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      logger.info('Payment intent retrieved successfully', { 
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status 
      });

      return {
        success: true,
        data: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret!,
          created: paymentIntent.created,
        },
      };
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Error retrieving payment intent', { 
        paymentIntentId,
        error: stripeError.message 
      });

      const paymentError: PaymentError = {
        message: stripeError.message,
        code: stripeError.code,
        statusCode: stripeError.statusCode || 500,
      };

      return {
        success: false,
        error: paymentError,
      };
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      logger.info('Payment intent confirmed successfully', { 
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status 
      });

      return {
        success: true,
        data: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret!,
          created: paymentIntent.created,
        },
      };
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Error confirming payment intent', { 
        paymentIntentId,
        error: stripeError.message 
      });

      const paymentError: PaymentError = {
        message: stripeError.message,
        code: stripeError.code,
        statusCode: stripeError.statusCode || 500,
      };

      return {
        success: false,
        error: paymentError,
      };
    }
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);

      logger.info('Payment intent cancelled successfully', { 
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status 
      });

      return {
        success: true,
        data: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret!,
          created: paymentIntent.created,
        },
      };
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Error cancelling payment intent', { 
        paymentIntentId,
        error: stripeError.message 
      });

      const paymentError: PaymentError = {
        message: stripeError.message,
        code: stripeError.code,
        statusCode: stripeError.statusCode || 500,
      };

      return {
        success: false,
        error: paymentError,
      };
    }
  }

  constructWebhookEvent(payload: string, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret
    );
  }
}

export default new StripeService(); 