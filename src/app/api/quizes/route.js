import { NextResponse } from "next/server";
import { getDB } from "../../../lib/mongo";
import jwt from "jsonwebtoken";

/**
 * GET: Fetch all quiz questions (flattened)
 */
export async function GET() {
  try {
    const db = await getDB();
    const quizzes = await db
      .collection("quiz_master_collection")
      .find({})
      .toArray();

    // Flatten all quiz questions across quizzes
    const questions = quizzes.flatMap(
      (quiz) =>
        quiz.questions?.map((q) => ({
          _id: q._id?.toString() || `${quiz._id}_${q.question}`,
          question: q.question,
          type: q.type,
          options: q.options || [],
          answer: q.answer,
          quizTitle: quiz.title,
        })) || []
    );

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

/**
 * POST: Admin can create a new quiz
 */
export async function POST(req) {
  try {
    // Verify JWT token from cookies
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

    const db = await getDB();
    const result = await db.collection("quiz_master_collection").insertOne({
        question: data.question,
        type: data.type,
        options: data.options || [],
        answer: data.answer,
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
