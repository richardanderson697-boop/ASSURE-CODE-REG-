/**
 * Embeddings generation using AI SDK
 */

import { embed } from "ai"

export interface EmbeddingResult {
  embedding: number[]
  text: string
  tokens: number
}

/**
 * Generate embeddings for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const { embedding, usage } = await embed({
    model: "openai/text-embedding-3-small",
    value: text,
  })

  return {
    embedding,
    text,
    tokens: usage.tokens,
  }
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  const results = await Promise.all(texts.map((text) => generateEmbedding(text)))
  return results
}

/**
 * Chunk text into smaller pieces for embedding
 */
export function chunkText(text: string, maxChunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length)
    const chunk = text.slice(start, end)

    // Try to break at sentence boundary
    const lastPeriod = chunk.lastIndexOf(".")
    const lastNewline = chunk.lastIndexOf("\n")
    const breakPoint = Math.max(lastPeriod, lastNewline)

    if (breakPoint > 0 && end < text.length) {
      chunks.push(text.slice(start, start + breakPoint + 1).trim())
      start = start + breakPoint + 1 - overlap
    } else {
      chunks.push(chunk.trim())
      start = end
    }

    // Prevent infinite loop
    if (start >= end) start = end
  }

  return chunks.filter((chunk) => chunk.length > 0)
}
