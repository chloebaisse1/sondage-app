/* eslint-disable react/no-unescaped-entities */
"use client"

import LogoutButton from "@/app/components/Logout"
import Results from "@/app/components/Results"
import { useEffect, useState } from "react"

const sondage = {
  question: "Quelle est votre technologie frontend préférée ?",
  options: [
    { label: "A", text: "React" },
    { label: "B", text: "Vue.js" },
    { label: "C", text: "Angular" },
    { label: "D", text: "Svelte" },
  ],
}

export default function Sondage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    async function checkVote() {
      const request = await fetch("/api/sondages")
      if (!request.ok) return
      const data = await request.json()
      if (data.alreadyVoted) {
        setSelected(data.answer)
        setVoted(true)
      }
      setChecking(false)
    }
    checkVote()
  }, [])

  async function handleVote() {
    if (!selected) return
    setLoading(true)
    const request = await fetch("/api/sondages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: selected, question: sondage.question }),
    })
    if (request.ok) {
      setVoted(true)
    } else {
      console.error("Erreur lors du vote")
    }
    setLoading(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-400">
        Chargement...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 gap-6">
      <div className="fixed top-0 right-0 p-4">
        <LogoutButton />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Sondage
          </h1>
          <p className="mt-3 text-gray-600 text-base font-medium">
            {sondage.question}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-3">
          {voted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="text-3xl">✓</span>
              <p className="text-gray-900 font-medium">Vous avez déjà voté !</p>
              <p className="text-sm text-gray-400">
                Vous avez voté pour l'option{" "}
                <span className="text-blue-500 font-semibold">
                  {sondage.options.find((o) => o.label === selected)?.text ??
                    selected}
                </span>
              </p>
            </div>
          ) : (
            <>
              {sondage.options.map((o) => (
                <button
                  key={o.label}
                  onClick={() => setSelected(o.label)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    selected === o.label
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      selected === o.label
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {o.label}
                  </span>
                  {o.text}
                </button>
              ))}
              <button
                onClick={handleVote}
                disabled={!selected || loading}
                className="mt-2 w-full flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Envoi..." : "Voter"}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setShowResults(!showResults)}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
        >
          {showResults ? "Masquer les résultats" : "Voir tous les résultats"}
        </button>
      </div>

      {showResults && (
        <div className="w-full max-w-xl">
          <Results options={sondage.options} />
        </div>
      )}
    </div>
  )
}
