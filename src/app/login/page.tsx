/* eslint-disable react/no-unescaped-entities */
"use client"

import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BeatLoader } from "react-spinners"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await authClient.signIn.email({
      email,
      password,
    })
    if (error) {
      console.log(error)
      setLoading(false)
    } else {
      router.push("/sondage")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Bon retour
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Carte formulaire */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-5"
        >
          {/* Champ email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-widest uppercase text-gray-400">
              Email
            </label>
            <input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Champ mot de passe */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-widest uppercase text-gray-400">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <BeatLoader color="#fff" size={8} /> : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="text-blue-500 hover:text-blue-400 transition font-medium"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
