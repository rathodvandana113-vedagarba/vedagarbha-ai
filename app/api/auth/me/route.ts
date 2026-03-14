import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/auth/me — fetch the current user's full profile from DB
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        dailyFreeCredits: true,
        lastClaimDate: true,
        studentStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset daily free credits if it's a new day
    const today = new Date().toISOString().split("T")[0];
    if (user.lastClaimDate !== today) {
      await prisma.user.update({
        where: { id: user.id },
        data: { dailyFreeCredits: 3, lastClaimDate: today },
      });
      user.dailyFreeCredits = 3;
      user.lastClaimDate = today;
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Profile Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/auth/me — update credits or other fields
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const updateData: any = {};

    if (typeof body.credits === "number") updateData.credits = body.credits;
    if (typeof body.dailyFreeCredits === "number") updateData.dailyFreeCredits = body.dailyFreeCredits;
    if (typeof body.studentStatus === "string") updateData.studentStatus = body.studentStatus;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        dailyFreeCredits: true,
        lastClaimDate: true,
        studentStatus: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
