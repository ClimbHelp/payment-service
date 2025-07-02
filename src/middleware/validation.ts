import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '../config/logger';

export const validateCreatePaymentIntent = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).uppercase().required(),
    payment_method_types: Joi.array().items(Joi.string()).min(1).required(),
    metadata: Joi.object().optional(),
    description: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    logger.warn('Validation error for create payment intent', { 
      error: error.details[0].message,
      body: req.body 
    });
    
    return res.status(400).json({
      success: false,
      error: {
        message: error.details[0].message,
        statusCode: 400,
      },
    });
  }

  next();
};

export const validatePaymentIntentId = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    paymentIntentId: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);
  
  if (error) {
    logger.warn('Validation error for payment intent ID', { 
      error: error.details[0].message,
      params: req.params 
    });
    
    return res.status(400).json({
      success: false,
      error: {
        message: error.details[0].message,
        statusCode: 400,
      },
    });
  }

  next();
};

export const validateConfirmPayment = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    paymentIntentId: Joi.string().required(),
    paymentMethodId: Joi.string().required(),
  });

  const { error } = schema.validate({
    paymentIntentId: req.params.paymentIntentId,
    paymentMethodId: req.body.paymentMethodId,
  });
  
  if (error) {
    logger.warn('Validation error for confirm payment', { 
      error: error.details[0].message,
      params: req.params,
      body: req.body 
    });
    
    return res.status(400).json({
      success: false,
      error: {
        message: error.details[0].message,
        statusCode: 400,
      },
    });
  }

  next();
}; 