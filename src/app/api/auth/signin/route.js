import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "../../../../lib/mongo.js";

export async function POST(req) {
  try {
    const { name, email, password, role = "user" } = await req.json();
    const db = await getDB();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    await users.insertOne({ name, email, password: hashed, role });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
