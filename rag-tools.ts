/**
 * RAG Tools for regulatory compliance analysis
 */

import { tool } from "ai"
import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { generateEmbedding } from "./embeddings"

/**
 * Search regulations tool using vector similarity
 */
export const searchRegulationsTool = tool({
  description: "Search regulatory database for relevant compliance documents using semantic search",
  inputSchema: z.object({
    query: z.string().describe("The search query about regulations or compliance requirements"),
    jurisdiction: z.enum(["US", "EU", "UK", "Canada", "All"]).optional().describe("Filter by jurisdiction"),
    limit: z.number().min(1).max(20).default(5).describe("Number of results to return"),
  }),
  execute: async ({ query, jurisdiction, limit }) => {
    const supabase = await createServerClient()

    // Generate embedding for the query
    const { embedding } = await generateEmbedding(query)

    // Search using vector similarity
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit,
    })

    if (error) {
      throw new Error(`Search failed: ${error.message}`)
    }

    return {
      results: data.map((doc: any) => ({
        id: doc.id,
        content: doc.content.substring(0, 500), // Return first 500 chars
        similarity: doc.similarity,
        metadata: doc.metadata,
      })),
      query,
      resultCount: data.length,
    }
  },
})

/**
 * Analyze regulation for compliance impact
 */
export const analyzeRegulationTool = tool({
  description: "Analyze a specific regulation document for compliance requirements and impact",
  inputSchema: z.object({
    documentId: z.string().describe("The ID of the regulation document to analyze"),
    companyContext: z.string().optional().describe("Optional context about the company for tailored analysis"),
  }),
  outputSchema: z.object({
    summary: z.string(),
    effectiveDate: z.string().optional(),
    jurisdiction: z.string(),
    affectedIndustries: z.array(z.string()),
    keyRequirements: z.array(
      z.object({
        requirement: z.string(),
        deadline: z.string().optional(),
        severity: z.enum(["critical", "high", "medium", "low"]),
      }),
    ),
    recommendations: z.array(z.string()),
  }),
})

/**
 * Get compliance context for a specific query
 */
export const getComplianceContextTool = tool({
  description: "Get relevant compliance context and regulatory background for a specific topic",
  inputSchema: z.object({
    topic: z.string().describe("The compliance topic to get context for"),
    industry: z.enum(["fintech", "healthtech", "energy", "general"]).optional().describe("Industry sector for context"),
  }),
  execute: async ({ topic, industry }) => {
    const supabase = await createServerClient()

    // Generate embedding for the topic
    const { embedding } = await generateEmbedding(topic)

    // Search for relevant context
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 3,
    })

    if (error) {
      throw new Error(`Context search failed: ${error.message}`)
    }

    return {
      topic,
      industry: industry || "general",
      context: data.map((doc: any) => ({
        content: doc.content,
        source: doc.metadata?.source || "Unknown",
        relevance: doc.similarity,
      })),
    }
  },
})

/**
 * All RAG tools for compliance assistant
 */
export const complianceTools = {
  searchRegulations: searchRegulationsTool,
  analyzeRegulation: analyzeRegulationTool,
  getComplianceContext: getComplianceContextTool,
}
