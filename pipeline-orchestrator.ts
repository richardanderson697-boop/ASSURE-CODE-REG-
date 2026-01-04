/**
 * Pipeline Orchestrator
 * Manages the end-to-end data processing pipeline
 */

import { EthicalScraper } from "../scraper/scraper"
import { DocumentProcessor } from "./document-processor"
import { generateEmbedding, chunkText } from "../ai/embeddings"
import { createServerClient } from "../supabase/server"

export interface PipelineOptions {
  sourceId: string
  url: string
  autoEmbed?: boolean
  autoProcess?: boolean
}

export interface PipelineResult {
  scrapedContentId: string
  regulationId?: string
  documentIds: string[]
  status: "success" | "partial" | "failed"
  errors: string[]
}

export class PipelineOrchestrator {
  private scraper: EthicalScraper
  private processor: DocumentProcessor

  constructor() {
    this.scraper = new EthicalScraper({
      respectRobotsTxt: true,
      rateLimitConfig: {
        requestsPerMinute: 30,
        minDelay: 1000,
        maxDelay: 3000,
      },
    })
    this.processor = new DocumentProcessor()
  }

  /**
   * Run complete pipeline: Scrape -> Process -> Embed
   */
  async runPipeline(options: PipelineOptions): Promise<PipelineResult> {
    const errors: string[] = []
    let scrapedContentId: string | null = null
    let regulationId: string | null = null
    const documentIds: string[] = []

    try {
      console.log(`[v0] Starting pipeline for: ${options.url}`)

      // Step 1: Scrape content
      const scrapeResult = await this.scraper.scrape(options.url)
      console.log(`[v0] Scraping completed`)

      // Step 2: Store scraped content
      const supabase = await createServerClient()

      const { data: scrapedData, error: scrapeError } = await supabase
        .from("scraped_content")
        .insert({
          url: scrapeResult.url,
          source_id: options.sourceId,
          content: scrapeResult.content,
          content_type: scrapeResult.contentType,
          title: scrapeResult.metadata.title,
          description: scrapeResult.metadata.description,
          scraped_at: scrapeResult.timestamp.toISOString(),
          status_code: scrapeResult.statusCode,
        })
        .select()
        .single()

      if (scrapeError || !scrapedData) {
        throw new Error(`Failed to store scraped content: ${scrapeError?.message}`)
      }

      scrapedContentId = scrapedData.id
      console.log(`[v0] Stored scraped content: ${scrapedContentId}`)

      // Step 3: Process content (if enabled)
      if (options.autoProcess !== false) {
        try {
          const cleanContent = this.processor.cleanHtmlContent(scrapeResult.content)
          const processedDoc = await this.processor.processDocument(
            cleanContent,
            scrapeResult.url,
            scrapeResult.metadata.title,
          )

          // Store processed regulation
          const { data: regulationData, error: regError } = await supabase
            .from("regulations")
            .insert({
              title: processedDoc.title,
              summary: processedDoc.summary,
              effective_date: processedDoc.effectiveDate || null,
              jurisdiction: processedDoc.jurisdiction,
              affected_industries: processedDoc.affectedIndustries,
              category: processedDoc.category,
              priority: processedDoc.priority,
              key_requirements: processedDoc.keyRequirements,
              source_url: processedDoc.sourceUrl,
              last_updated: processedDoc.lastUpdated || new Date().toISOString(),
              scraped_content_id: scrapedContentId,
            })
            .select()
            .single()

          if (regError) {
            console.error(`[v0] Failed to store regulation:`, regError)
            errors.push(`Processing error: ${regError.message}`)
          } else {
            regulationId = regulationData.id
            console.log(`[v0] Stored regulation: ${regulationId}`)
          }
        } catch (processError) {
          console.error(`[v0] Processing error:`, processError)
          errors.push(`Processing failed: ${processError instanceof Error ? processError.message : "Unknown error"}`)
        }
      }

      // Step 4: Generate embeddings (if enabled)
      if (options.autoEmbed !== false) {
        try {
          const cleanContent = this.processor.cleanHtmlContent(scrapeResult.content)
          const chunks = chunkText(cleanContent, 1000, 200)
          console.log(`[v0] Created ${chunks.length} chunks for embedding`)

          for (let i = 0; i < chunks.length; i++) {
            try {
              const { embedding } = await generateEmbedding(chunks[i])

              const { data: docData, error: embedError } = await supabase
                .from("documents")
                .insert({
                  scraped_content_id: scrapedContentId,
                  content: chunks[i],
                  chunk_index: i,
                  embedding,
                  metadata: {
                    title: scrapeResult.metadata.title,
                    url: scrapeResult.url,
                    source_id: options.sourceId,
                    scraped_at: scrapeResult.timestamp.toISOString(),
                    regulation_id: regulationId,
                  },
                })
                .select()
                .single()

              if (embedError) {
                console.error(`[v0] Failed to store chunk ${i}:`, embedError)
                errors.push(`Embedding chunk ${i} failed: ${embedError.message}`)
              } else {
                documentIds.push(docData.id)
              }
            } catch (chunkError) {
              console.error(`[v0] Chunk ${i} embedding error:`, chunkError)
              errors.push(`Chunk ${i} failed`)
            }
          }

          console.log(`[v0] Embedded ${documentIds.length}/${chunks.length} chunks`)
        } catch (embedError) {
          console.error(`[v0] Embedding error:`, embedError)
          errors.push(`Embedding failed: ${embedError instanceof Error ? embedError.message : "Unknown error"}`)
        }
      }

      // Determine status
      let status: "success" | "partial" | "failed"
      if (errors.length === 0) {
        status = "success"
      } else if (scrapedContentId) {
        status = "partial"
      } else {
        status = "failed"
      }

      console.log(`[v0] Pipeline completed with status: ${status}`)

      return {
        scrapedContentId: scrapedContentId || "",
        regulationId: regulationId || undefined,
        documentIds,
        status,
        errors,
      }
    } catch (error) {
      console.error(`[v0] Pipeline failed:`, error)

      return {
        scrapedContentId: scrapedContentId || "",
        regulationId: regulationId || undefined,
        documentIds,
        status: "failed",
        errors: [...errors, error instanceof Error ? error.message : "Pipeline failed"],
      }
    }
  }
}
