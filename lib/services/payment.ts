/**
 * Razorpay Payment Service Integration
 * =====================================
 * This module prepares external API calls to Razorpay using env variables.
 * 
 * INTEGRATION INSTRUCTIONS:
 * 1. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file.
 * 2. Uncomment the razorpay instance creation below.
 * 3. Use the Razorpay Node SDK (`npm install razorpay`) to communicate with Razorpay APIs.
 */

import Razorpay from "razorpay";
import crypto from "crypto";

export async function createRazorpayOrder(amountInPaise: number) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn("Razorpay keys are missing. Running in mock mode.");
    return {
      id: `order_mock_${Date.now()}`,
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created"
    };
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  
  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };
  
  const order = await razorpay.orders.create(options);
  return order;
}

export async function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    // Mock successful verification
    return true;
  }

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  
  return expectedSignature === signature;
}
