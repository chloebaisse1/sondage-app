import { auth } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const db = await getDb()

  if (session) {
    const existingVote = await db
      .collection("sondages")
      .findOne({ userId: session.user.id })

    if (existingVote) {
      return NextResponse.json({
        alreadyVoted: true,
        answer: existingVote.answer,
      })
    }
  }

  return NextResponse.json({ alreadyVoted: false })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session)
    return NextResponse.json(
      { error: "Vous n'etes pas connecté" },
      { status: 401 },
    )

  const { answer } = await request.json()

  if (!answer)
    return NextResponse.json(
      { error: "La réponse est manquante" },
      { status: 400 },
    )

  const db = await getDb()

  const existingVote = await db
    .collection("sondages")
    .findOne({ userId: session.user.id })

  if (existingVote)
    return NextResponse.json({ error: "Vous avez déjà voté" }, { status: 403 })

  const vote = {
    answer,
    createdAt: new Date(),
    userId: session.user.id,
    userName: session.user.name,
  }
  await db.collection("sondages").insertOne(vote)
  return NextResponse.json(vote, { status: 201 })
}
