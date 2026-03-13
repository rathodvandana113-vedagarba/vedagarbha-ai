import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/services/payment";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    const isValid = await verifyRazorpayPayment(orderId, paymentId, signature);
    
    if (isValid) {
      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify order" }, { status: 500 });
  }
}
