import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Bienvenue sur <span className="text-blue-500">VotePulse</span>
        </h1>
        <p className="mt-3 text-gray-400 text-sm">
          Donnez votre avis en quelques secondes
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors duration-200"
        >
          Participer
        </Link>
      </div>
    </main>
  )
}
