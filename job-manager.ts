/**
 * Job Manager
 * Manages scraping jobs queue and execution
 */

import { createServerClient } from "../supabase/server"
import { PipelineOrchestrator } from "../pipeline/pipeline-orchestrator"

export interface Job {
  id: string
  source_id: string
  url: string
  status: "pending" | "running" | "completed" | "failed"
  priority: number
  scheduled_at: string
  started_at?: string
  completed_at?: string
  error_message?: string
  retry_count: number
  max_retries: number
}

export class JobManager {
  private orchestrator: PipelineOrchestrator

  constructor() {
    this.orchestrator = new PipelineOrchestrator()
  }

  /**
   * Create a new scraping job
   */
  async createJob(sourceId: string, url: string, priority = 0, scheduledAt?: Date): Promise<string> {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("scraping_jobs")
      .insert({
        source_id: sourceId,
        url,
        priority,
        scheduled_at: scheduledAt?.toISOString() || new Date().toISOString(),
        status: "pending",
        retry_count: 0,
        max_retries: 3,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create job: ${error.message}`)
    }

    console.log(`[v0] Created job: ${data.id}`)
    return data.id
  }

  /**
   * Get next pending job to execute
   */
  async getNextJob(): Promise<Job | null> {
    const supabase = await createServerClient()

    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("scraping_jobs")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_at", now)
      .order("priority", { ascending: false })
      .order("scheduled_at", { ascending: true })
      .limit(1)
      .single()

    if (error || !data) {
      return null
    }

    return data as Job
  }

  /**
   * Update job status
   */
  async updateJobStatus(jobId: string, status: Job["status"], errorMessage?: string): Promise<void> {
    const supabase = await createServerClient()

    const updates: any = { status, updated_at: new Date().toISOString() }

    if (status === "running") {
      updates.started_at = new Date().toISOString()
    } else if (status === "completed" || status === "failed") {
      updates.completed_at = new Date().toISOString()
    }

    if (errorMessage) {
      updates.error_message = errorMessage
    }

    const { error } = await supabase.from("scraping_jobs").update(updates).eq("id", jobId)

    if (error) {
      console.error(`[v0] Failed to update job ${jobId}:`, error)
    }
  }

  /**
   * Execute a job
   */
  async executeJob(job: Job): Promise<void> {
    console.log(`[v0] Executing job: ${job.id}`)

    // Update status to running
    await this.updateJobStatus(job.id, "running")

    try {
      // Run the pipeline
      const result = await this.orchestrator.runPipeline({
        sourceId: job.source_id,
        url: job.url,
        autoEmbed: true,
        autoProcess: true,
      })

      if (result.status === "success" || result.status === "partial") {
        await this.updateJobStatus(job.id, "completed")
        console.log(`[v0] Job ${job.id} completed successfully`)
      } else {
        throw new Error(result.errors.join(", "))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error(`[v0] Job ${job.id} failed:`, errorMessage)

      const supabase = await createServerClient()

      // Check if we should retry
      if (job.retry_count < job.max_retries) {
        // Increment retry count and reschedule
        const { error: updateError } = await supabase
          .from("scraping_jobs")
          .update({
            status: "pending",
            retry_count: job.retry_count + 1,
            error_message: errorMessage,
            scheduled_at: new Date(Date.now() + 60000 * Math.pow(2, job.retry_count)).toISOString(), // Exponential backoff
          })
          .eq("id", job.id)

        if (updateError) {
          console.error(`[v0] Failed to reschedule job:`, updateError)
        } else {
          console.log(`[v0] Job ${job.id} rescheduled for retry ${job.retry_count + 1}/${job.max_retries}`)
        }
      } else {
        // Max retries reached, mark as failed
        await this.updateJobStatus(job.id, "failed", errorMessage)
      }
    }
  }

  /**
   * Process job queue
   */
  async processQueue(maxJobs = 5): Promise<number> {
    console.log(`[v0] Processing job queue (max ${maxJobs} jobs)`)

    let processed = 0

    for (let i = 0; i < maxJobs; i++) {
      const job = await this.getNextJob()

      if (!job) {
        console.log(`[v0] No more pending jobs`)
        break
      }

      await this.executeJob(job)
      processed++
    }

    console.log(`[v0] Processed ${processed} jobs`)
    return processed
  }

  /**
   * Get job statistics
   */
  async getJobStats(): Promise<{
    pending: number
    running: number
    completed: number
    failed: number
  }> {
    const supabase = await createServerClient()

    const statuses = ["pending", "running", "completed", "failed"]
    const stats: any = {
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
    }

    for (const status of statuses) {
      const { count } = await supabase
        .from("scraping_jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", status)

      stats[status] = count || 0
    }

    return stats
  }

  /**
   * Bulk create jobs from source URLs
   */
  async bulkCreateJobs(sourceId: string, urls: string[], priority = 0): Promise<string[]> {
    const supabase = await createServerClient()

    const jobs = urls.map((url) => ({
      source_id: sourceId,
      url,
      priority,
      status: "pending" as const,
      retry_count: 0,
      max_retries: 3,
    }))

    const { data, error } = await supabase.from("scraping_jobs").insert(jobs).select("id")

    if (error) {
      throw new Error(`Failed to create bulk jobs: ${error.message}`)
    }

    console.log(`[v0] Created ${data.length} bulk jobs`)
    return data.map((job) => job.id)
  }
}
