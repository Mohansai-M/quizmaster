"use client";
import { useEffect, useState } from "react";

export default function TakeQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("/api/quizes")
      .then((res) => res.json())
      .then(setQuizzes)
      .catch(console.error);
  }, []);
console.log(quizzes)
  function handleSelect(qid, option) {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    let sc = 0;
    quizzes.forEach((q) => {
      const userAnswer = answers[q._id]?.trim()?.toLowerCase();
      const correctAnswer = q.answer?.trim()?.toLowerCase();
      if (userAnswer === correctAnswer) sc++;
    });
    setScore(sc);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Take a Quiz
      </h1>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md"
        >
          {quizzes.map((q, i) => (
            <div key={q._id} className="mb-6 border-b pb-4">
              <h2 className="font-semibold mb-2">
                {i + 1}. {q.question}
              </h2>

            
              {q.type === "mcq" && (
                <div className="space-y-2">
                  {q.options?.map((opt, j) => (
                    <label key={j} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={answers[q._id] === opt}
                        onChange={() => handleSelect(q._id, opt)}
                        disabled={submitted}
                        required
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "boolean" && (
                <div className="space-y-2">
                  {["True", "False"].map((opt, j) => (
                    <label key={j} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={answers[q._id] === opt}
                        onChange={() => handleSelect(q._id, opt)}
                        disabled={submitted}
                        required
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "text" && (
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded mt-2"
                  placeholder="Enter your answer"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleSelect(q._id, e.target.value)}
                  disabled={submitted}
                  required
                />
              )}

           
              {submitted && (
                <p
                  className={`mt-2 text-sm ${
                    answers[q._id]?.trim()?.toLowerCase() ===
                    q.answer?.trim()?.toLowerCase()
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {answers[q._id]?.trim()?.toLowerCase() ===
                  q.answer?.trim()?.toLowerCase()
                    ? "Correct!"
                    : `Incorrect! Correct answer: ${q.answer}`}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Quiz
          </button>
        </form>
      ) : (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl text-center shadow-md">
          <h2 className="text-2xl font-semibold mb-2">🎯 Your Score</h2>
          <p className="text-lg mb-4">
            {score} / {quizzes.length}
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
              setScore(0);
            }}
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
