/**
 * Semantic Search Engine
 * Vector-based search for regulatory documents
 */

import { createServerClient } from "../supabase/server"
import { generateEmbedding } from "../ai/embeddings"

export interface SearchFilter {
  jurisdiction?: string[]
  category?: string[]
  priority?: string[]
  dateRange?: {
    start: string
    end: string
  }
}

export interface SearchResult {
  id: string
  regulationId?: string
  title: string
  content: string
  summary?: string
  jurisdiction?: string
  category?: string
  priority?: string
  similarity: number
  url: string
  effectiveDate?: string
}

export class SemanticSearchEngine {
  /**
   * Perform semantic search using vector embeddings
   */
  async search(query: string, filters: SearchFilter = {}, limit = 10): Promise<SearchResult[]> {
    const supabase = await createServerClient()

    console.log(`[v0] Semantic search: "${query}"`)

    // Generate query embedding
    const { embedding } = await generateEmbedding(query)

    // Perform vector search
    const { data: documents, error } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.6,
      match_count: limit * 2, // Get more results for filtering
    })

    if (error) {
      console.error("[v0] Search error:", error)
      throw new Error(`Search failed: ${error.message}`)
    }

    console.log(`[v0] Found ${documents.length} matching documents`)

    // Extract regulation IDs from document metadata
    const regulationIds = documents
      .map((doc: any) => doc.metadata?.regulation_id)
      .filter((id: any) => id !== undefined && id !== null)

    // Fetch associated regulations
    let regulations: any[] = []
    if (regulationIds.length > 0) {
      const { data: regsData } = await supabase.from("regulations").select("*").in("id", regulationIds)

      regulations = regsData || []
    }

    // Map documents to search results
    const results: SearchResult[] = documents.map((doc: any) => {
      const regulationId = doc.metadata?.regulation_id
      const regulation = regulations.find((r) => r.id === regulationId)

      return {
        id: doc.id,
        regulationId,
        title: doc.metadata?.title || regulation?.title || "Untitled",
        content: doc.content,
        summary: regulation?.summary,
        jurisdiction: regulation?.jurisdiction,
        category: regulation?.category,
        priority: regulation?.priority,
        similarity: doc.similarity,
        url: doc.metadata?.url || regulation?.source_url || "",
        effectiveDate: regulation?.effective_date,
      }
    })

    // Apply filters
    let filteredResults = results

    if (filters.jurisdiction && filters.jurisdiction.length > 0) {
      filteredResults = filteredResults.filter((r) => r.jurisdiction && filters.jurisdiction!.includes(r.jurisdiction))
    }

    if (filters.category && filters.category.length > 0) {
      filteredResults = filteredResults.filter((r) => r.category && filters.category!.includes(r.category))
    }

    if (filters.priority && filters.priority.length > 0) {
      filteredResults = filteredResults.filter((r) => r.priority && filters.priority!.includes(r.priority))
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      filteredResults = filteredResults.filter((r) => {
        if (!r.effectiveDate) return false
        return r.effectiveDate >= start && r.effectiveDate <= end
      })
    }

    // Return top results up to limit
    return filteredResults.slice(0, limit)
  }

  /**
   * Get similar documents to a given document
   */
  async findSimilar(documentId: string, limit = 5): Promise<SearchResult[]> {
    const supabase = await createServerClient()

    // Get the document's embedding
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("embedding, metadata")
      .eq("id", documentId)
      .single()

    if (docError || !document) {
      throw new Error("Document not found")
    }

    // Search for similar documents
    const { data: documents, error } = await supabase.rpc("match_documents", {
      query_embedding: document.embedding,
      match_threshold: 0.7,
      match_count: limit + 1, // +1 to exclude the source document
    })

    if (error) {
      throw new Error(`Similarity search failed: ${error.message}`)
    }

    // Filter out the source document and map to results
    const results: SearchResult[] = documents
      .filter((doc: any) => doc.id !== documentId)
      .slice(0, limit)
      .map((doc: any) => ({
        id: doc.id,
        title: doc.metadata?.title || "Untitled",
        content: doc.content,
        similarity: doc.similarity,
        url: doc.metadata?.url || "",
        jurisdiction: doc.metadata?.jurisdiction,
      }))

    return results
  }

  /**
   * Hybrid search combining keyword and semantic search
   */
  async hybridSearch(query: string, filters: SearchFilter = {}, limit = 10): Promise<SearchResult[]> {
    const supabase = await createServerClient()

    // Perform semantic search
    const semanticResults = await this.search(query, filters, limit)

    // Perform keyword search on regulations table
    let keywordQuery = supabase.from("regulations").select("*").textSearch("title", query, {
      type: "websearch",
    })

    if (filters.jurisdiction && filters.jurisdiction.length > 0) {
      keywordQuery = keywordQuery.in("jurisdiction", filters.jurisdiction)
    }

    if (filters.category && filters.category.length > 0) {
      keywordQuery = keywordQuery.in("category", filters.category)
    }

    if (filters.priority && filters.priority.length > 0) {
      keywordQuery = keywordQuery.in("priority", filters.priority)
    }

    const { data: keywordResults } = await keywordQuery.limit(limit)

    // Merge and deduplicate results
    const mergedResults: Map<string, SearchResult> = new Map()

    // Add semantic results
    for (const result of semanticResults) {
      if (result.regulationId) {
        mergedResults.set(result.regulationId, result)
      }
    }

    // Add keyword results
    if (keywordResults) {
      for (const regulation of keywordResults) {
        if (!mergedResults.has(regulation.id)) {
          mergedResults.set(regulation.id, {
            id: regulation.id,
            regulationId: regulation.id,
            title: regulation.title,
            content: regulation.summary || "",
            summary: regulation.summary,
            jurisdiction: regulation.jurisdiction,
            category: regulation.category,
            priority: regulation.priority,
            similarity: 0.5, // Default similarity for keyword matches
            url: regulation.source_url,
            effectiveDate: regulation.effective_date,
          })
        }
      }
    }

    // Sort by similarity and return top results
    return Array.from(mergedResults.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }
}
