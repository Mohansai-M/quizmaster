import { NextResponse } from "next/server";
import { getDB } from "../../../lib/mongo";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const db = await getDB();
    const quizzes = await db
      .collection("quiz_master_collection")
      .find({})
      .toArray();

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can create quizzes" },
        { status: 403 }
      );
    }


    const data = await req.json();
    if (!data.title || !Array.isArray(data.questions)) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 400 });
    }

 
    const db = await getDB();
    const result = await db.collection("quiz_master_collection").insertOne({
      ...data,
      createdBy: decoded.email,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Quiz added successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding quiz:", error);
    return NextResponse.json({ error: "Failed to add quiz" }, { status: 500 });
  }
}