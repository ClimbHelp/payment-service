import { Request, Response } from 'express';
import stripeService from '../services/stripe.service';
import logger from '../config/logger';
import { CreatePaymentIntentRequest } from '../types/payment';

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const request: CreatePaymentIntentRequest = req.body;
    
    logger.info('Creating payment intent', { 
      amount: request.amount,
      currency: request.currency 
    });

    const result = await stripeService.createPaymentIntent(request);
    
    if (result.success && result.data) {
      return res.status(201).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Unexpected error in createPaymentIntent', { error });
    
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
};

export const getPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;
    
    logger.info('Retrieving payment intent', { paymentIntentId });

    const result = await stripeService.retrievePaymentIntent(paymentIntentId);
    
    if (result.success && result.data) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Unexpected error in getPaymentIntent', { error });
    
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;
    const { paymentMethodId } = req.body;
    
    logger.info('Confirming payment intent', { 
      paymentIntentId,
      paymentMethodId 
    });

    const result = await stripeService.confirmPaymentIntent(paymentIntentId, paymentMethodId);
    
    if (result.success && result.data) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Unexpected error in confirmPayment', { error });
    
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
};

export const cancelPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;
    
    logger.info('Cancelling payment intent', { paymentIntentId });

    const result = await stripeService.cancelPaymentIntent(paymentIntentId);
    
    if (result.success && result.data) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Unexpected error in cancelPayment', { error });
    
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      logger.warn('Webhook signature missing');
      return res.status(400).json({ error: 'Missing signature' });
    }

    const event = stripeService.constructWebhookEvent(req.body, signature);
    
    logger.info('Webhook event received', { 
      type: event.type,
      id: event.id 
    });

    switch (event.type) {
      case 'payment_intent.succeeded':
        logger.info('Payment succeeded', { 
          paymentIntentId: event.data.object.id 
        });
        break;
        
      case 'payment_intent.payment_failed':
        logger.warn('Payment failed', { 
          paymentIntentId: event.data.object.id 
        });
        break;
        
      case 'payment_intent.canceled':
        logger.info('Payment canceled', { 
          paymentIntentId: event.data.object.id 
        });
        break;
        
      default:
        logger.info('Unhandled event type', { type: event.type });
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error', { error });
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }
}; 