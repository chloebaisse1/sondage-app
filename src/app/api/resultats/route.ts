import { getDb } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  const db = await getDb()

  const resultats = await db
    .collection("sondages")
    .aggregate([
      {
        $group: {
          _id: "$answer",
          total: { $sum: 1 },
          users: { $push: "$userName" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray()

  const total = resultats.reduce((acc, r) => acc + r.total, 0)

  return NextResponse.json({ resultats, total })
}
