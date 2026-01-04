/**
 * Job statistics API
 */

import { createServerClient } from "@/lib/supabase/server"
import { JobManager } from "@/lib/jobs/job-manager"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const manager = new JobManager()
    const stats = await manager.getJobStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("[v0] Job stats error:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch job stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
