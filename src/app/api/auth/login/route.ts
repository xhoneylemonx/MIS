import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Admin login
    if (emailLower === "admin@example.com") {
      return NextResponse.json({
        user: {
          id: "admin",
          email: emailLower,
          role: "admin",
          name: "Admin MIS",
          avatar: "",
        },
      });
    }

    // Student login — look up by studentId pattern or email
    // Extract studentId from email like "65012345@mju.ac.th" or direct studentId
    let studentIdQuery = emailLower;
    if (emailLower.includes("@")) {
      studentIdQuery = emailLower.split("@")[0];
    }

    // Also support "student@example.com" as a demo login
    if (emailLower === "student@example.com") {
      // Find the first student as demo
      const firstStudent = await prisma.student.findFirst({
        orderBy: { createdAt: "asc" },
      });
      if (firstStudent) {
        return NextResponse.json({
          user: {
            id: firstStudent.id,
            email: emailLower,
            role: "student",
            studentId: firstStudent.id, // Real DB UUID
            name: firstStudent.name,
            avatar: "",
          },
        });
      }
    }

    // Look up by studentId
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { studentId: studentIdQuery },
          { studentId: { contains: studentIdQuery } },
        ],
      },
    });

    if (student) {
      return NextResponse.json({
        user: {
          id: student.id,
          email: emailLower,
          role: "student",
          studentId: student.id, // Real DB UUID
          name: student.name,
          avatar: "",
        },
      });
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
