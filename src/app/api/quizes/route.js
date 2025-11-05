import { NextResponse } from "next/server";
import { getDB } from "../../../lib/mongo";

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
    const data = await req.json();
    const db = await getDB();
    const result = await db
      .collection("quiz_master_collection")
      .insertOne(data);
    return NextResponse.json({ message: "Quiz added", id: result.insertedId });
  } catch (error) {
    console.error("Error adding quiz:", error);
    return NextResponse.json({ error: "Failed to add quiz" }, { status: 500 });
  }
}