import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/services/payment";

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount in INR is required" }, { status: 400 });
    }

    // Convert INR to Paise (Razopay requirement)
    const amountInPaise = amount * 100;
    
    const order = await createRazorpayOrder(amountInPaise);
    return NextResponse.json({ success: true, order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
