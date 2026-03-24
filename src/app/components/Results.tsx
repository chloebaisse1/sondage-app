"use client"

import { useEffect, useState } from "react"

interface Resultat {
  _id: string
  total: number
  users: string[]
}

interface Option {
  label: string
  text: string
}

interface ResultsProps {
  options: Option[]
}

const colors: Record<string, string> = {
  A: "bg-blue-500",
  B: "bg-violet-500",
  C: "bg-emerald-500",
  D: "bg-orange-500",
}

const textColors: Record<string, string> = {
  A: "text-blue-500",
  B: "text-violet-500",
  C: "text-emerald-500",
  D: "text-orange-500",
}

const bgLightColors: Record<string, string> = {
  A: "bg-blue-50 text-blue-600",
  B: "bg-violet-50 text-violet-600",
  C: "bg-emerald-50 text-emerald-600",
  D: "bg-orange-50 text-orange-600",
}

export default function Results({ options }: ResultsProps) {
  const [resultats, setResultats] = useState<Resultat[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      const request = await fetch("/api/resultats")
      if (!request.ok) return
      const data = await request.json()
      setResultats(data.resultats)
      setTotal(data.total)
      setLoading(false)
    }
    fetchResults()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-400">
        Chargement...
      </div>
    )
  }

  if (resultats.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-400">
        Aucun vote pour le moment.
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Résultats
        </h2>
        <span className="text-xs text-gray-400">
          {total} vote{total > 1 ? "s" : ""}
        </span>
      </div>

      {options.map(({ label, text }) => {
        const r = resultats.find((r) => r._id === label)
        const count = r?.total ?? 0
        const percent = total > 0 ? Math.round((count / total) * 100) : 0
        const users = r?.users ?? []

        return (
          <div key={label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${colors[label]}`}
                >
                  {label}
                </span>
                <span className="text-gray-700 font-medium">{text}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${textColors[label]}`}>
                  {percent}%
                </span>
                <span className="text-xs text-gray-400">
                  ({count} vote{count > 1 ? "s" : ""})
                </span>
              </div>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${colors[label]}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            {users.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {users.map((name, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${bgLightColors[label]}`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
