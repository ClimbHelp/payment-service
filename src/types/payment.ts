export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  created: number;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  payment_method_types: string[];
  metadata?: Record<string, string>;
  description?: string;
}

export interface PaymentWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

export interface PaymentError {
  message: string;
  code?: string;
  statusCode: number;
}

export interface PaymentSuccess {
  success: true;
  data: PaymentIntent;
}

export interface PaymentResponse {
  success: boolean;
  data?: PaymentIntent;
  error?: PaymentError;
} 