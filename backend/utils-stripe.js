// utils/stripe.js - Stripe Payment Utilities
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe Error: ${error.message}`);
  }
};

export const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    throw new Error(`Stripe Error: ${error.message}`);
  }
};

export const createRefund = async (paymentIntentId, amount = null) => {
  try {
    return await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount: Math.round(amount * 100) })
    });
  } catch (error) {
    throw new Error(`Stripe Refund Error: ${error.message}`);
  }
};

export const verifyWebhookSignature = (body, signature) => {
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
};
