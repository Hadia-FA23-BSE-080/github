import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripe;
}

export interface CreatePaymentIntentParams {
  amount: number; // in pence
  currency?: string;
  jobReference: string;
  customerEmail: string;
  description: string;
  payLater?: boolean;
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  const stripeClient = getStripe();

  if (!stripeClient) {
    return {
      mock: true,
      clientSecret: `mock_secret_${params.jobReference}`,
      paymentIntentId: `mock_pi_${Date.now()}`,
      message: "Stripe not configured — using mock payment",
    };
  }

  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: Math.round(params.amount),
    currency: params.currency ?? "gbp",
    metadata: {
      jobReference: params.jobReference,
      payLater: params.payLater ? "true" : "false",
    },
    receipt_email: params.customerEmail,
    description: params.description,
    ...(params.payLater
      ? {
          payment_method_options: {
            card: { request_three_d_secure: "automatic" },
          },
        }
      : {}),
  });

  return {
    mock: false,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}

export async function createCheckoutSession(params: {
  amount: number;
  jobReference: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  payLater?: boolean;
}) {
  const stripeClient = getStripe();

  if (!stripeClient) {
    return {
      mock: true,
      url: `${params.successUrl}?mock_payment=true&job=${params.jobReference}`,
    };
  }

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `TradePro 360 — Job ${params.jobReference}`,
          },
          unit_amount: Math.round(params.amount),
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobReference: params.jobReference,
      payLater: params.payLater ? "true" : "false",
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return { mock: false, url: session.url };
}
