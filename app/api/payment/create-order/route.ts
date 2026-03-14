import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/services/payment";

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount in INR is required" }, { status: 400 });
    }

    // Convert INR to Paise (Razopay requirement) - MUST be an integer to avoid Internal Gateway Error
    const amountInPaise = Math.round(amount * 100);
    
    const order = await createRazorpayOrder(amountInPaise);
    return NextResponse.json({ success: true, order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error: any) {
    console.error("[CRITICAL] Create Order Error:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
<<<<<<< HEAD
    return NextResponse.json({ 
      error: error.message || "Failed to create order",
      details: error.description || "Internal Gateway Error"
=======
    const trueError = error?.error?.description || error?.message || String(error);
    return NextResponse.json({ 
      error: "Failed to create order",
      details: trueError
>>>>>>> origin/main
    }, { status: 500 });
  }
}
