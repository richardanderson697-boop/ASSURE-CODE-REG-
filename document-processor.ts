/**
 * Document Processor
 * Processes raw scraped content into structured regulatory data
 */

import { generateObject } from "ai"
import { z } from "zod"

export const regulatoryDocumentSchema = z.object({
  title: z.string(),
  summary: z.string().describe("A concise summary of the regulation"),
  effectiveDate: z.string().optional().describe("When the regulation takes effect"),
  jurisdiction: z.enum(["US", "EU", "UK", "Canada", "International"]),
  affectedIndustries: z
    .array(z.enum(["fintech", "healthtech", "energy", "general", "technology", "manufacturing", "retail"]))
    .describe("Industries affected by this regulation"),
  category: z.enum(["financial", "privacy", "healthcare", "environmental", "general"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  keyRequirements: z.array(z.string()).describe("Main compliance requirements"),
  sourceUrl: z.string(),
  lastUpdated: z.string().optional(),
})

export type RegulatoryDocument = z.infer<typeof regulatoryDocumentSchema>

export class DocumentProcessor {
  /**
   * Extract structured data from raw HTML/text content
   */
  async processDocument(content: string, url: string, title?: string): Promise<RegulatoryDocument> {
    console.log(`[v0] Processing document: ${url}`)

    // Use AI to extract structured information
    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: regulatoryDocumentSchema,
      messages: [
        {
          role: "system",
          content: `You are an expert at extracting structured regulatory information from legal documents.
Extract the key information from the provided regulatory text.
If information is not available, use reasonable defaults or omit optional fields.`,
        },
        {
          role: "user",
          content: `Extract regulatory information from this document:

URL: ${url}
Title: ${title || "Unknown"}

Content:
${content.substring(0, 8000)}`, // Limit content size
        },
      ],
      maxOutputTokens: 2000,
    })

    console.log(`[v0] Processed document successfully`)

    return {
      ...object,
      sourceUrl: url,
    }
  }

  /**
   * Clean and normalize HTML content
   */
  cleanHtmlContent(html: string): string {
    // Remove script and style tags
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]+>/g, " ")

    // Decode HTML entities
    cleaned = cleaned
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim()

    return cleaned
  }

  /**
   * Extract text from PDF content (placeholder for actual PDF parsing)
   */
  async extractPdfText(pdfBuffer: Buffer): Promise<string> {
    // In a real implementation, use a PDF parsing library
    // For now, return placeholder
    console.log("[v0] PDF extraction not yet implemented")
    return "PDF content extraction pending implementation"
  }
}
