"use client";
import { useEffect, useState } from "react";

export default function QuizesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("mcq");
  const [options, setOptions] = useState("");
  const [answer, setAnswer] = useState("");

  // Load all quizzes
  useEffect(() => {
    fetch("/api/quizes")
      .then((res) => res.json())
      .then(setQuizzes)
      .catch(console.error);
  }, []);

  async function addQuiz(e) {
    e.preventDefault();

    let payload = {
      question,
      type: questionType,
      answer,
    };

    if (questionType === "mcq") {
      payload.options = options.split(",").map((opt) => opt.trim());
    } else if (questionType === "boolean") {
      payload.options = ["True", "False"];
    }

    const res = await fetch("/api/quizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Quiz added!");
      setQuestion("");
      setOptions("");
      setAnswer("");
      const updated = await fetch("/api/quizes").then((r) => r.json());
      setQuizzes(updated);
    } else {
      alert("Failed to add quiz");
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">QuizMaster Admin</h1>

      <form
        onSubmit={addQuiz}
        className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-md mb-8"
      >
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
          required
        />

        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        >
          <option value="mcq">Multiple Choice</option>
          <option value="boolean">True / False</option>
          <option value="text">Text Based</option>
        </select>

        {questionType === "mcq" && (
          <input
            type="text"
            placeholder="Options (comma separated)"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
        )}

        {questionType === "boolean" && (
          <p className="text-gray-600 mb-2 text-sm">
            Options will be automatically set to <b>True / False</b>
          </p>
        )}

        <input
          type="text"
          placeholder="Correct answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Add Quiz
        </button>
      </form>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">All Quizzes</h2>
        <ul className="space-y-3">
          {quizzes.map((q) => (
            <li
              key={q._id}
              className="p-3 bg-white shadow-sm border rounded-lg"
            >
              <p className="font-medium">{q.question}</p>
              <p className="text-sm text-gray-500 italic">({q.type})</p>
              {q.options && q.options.length > 0 && (
                <ul className="list-disc ml-5 text-gray-600">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}
              <p className="text-sm text-green-600 mt-1">Correct: {q.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
