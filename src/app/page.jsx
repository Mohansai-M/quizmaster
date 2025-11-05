import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">
        Welcome to QuizMaster
      </h1>
      <div className="flex gap-6">
        <Link
          href="/take-quiz"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Take a Quiz
        </Link>
        <Link
          href="/quizzes"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Admin Panel
        </Link>
      </div>
    </main>
  );
}
