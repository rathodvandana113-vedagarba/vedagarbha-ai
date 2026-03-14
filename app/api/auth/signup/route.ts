import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const today = new Date().toISOString().split("T")[0];
    const user = (await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        passwordHash,
        credits: 10, // Welcome bonus
        dailyFreeCredits: 3,
        lastClaimDate: today,
        studentStatus: "none",
      } as any,
    })) as any;

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 });
  }
}
