"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors duration-200"
    >
      Se déconnecter
    </button>
  )
}
