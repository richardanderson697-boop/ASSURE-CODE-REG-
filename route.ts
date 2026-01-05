import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"
import { generateEmbeddings, chunkDocument } from "@/lib/ai/embeddings"

export async function POST(request: Request) {
  try {
    const { documents } = await request.json()

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json({ error: "documents array is required" }, { status: 400 })
    }

    const supabase = createClient()
    const results = []

    for (const doc of documents) {
      try {
        const { content, metadata } = doc

        if (!content || !metadata) {
          results.push({
            success: false,
            error: "content and metadata are required",
            metadata: metadata || {},
          })
          continue
        }

        // Insert document
        const { data: document, error: docError } = await supabase
          .from("regulatory_updates")
          .insert({
            title: metadata.title,
            content,
            source_url: metadata.source,
            jurisdiction: metadata.jurisdiction,
            regulation_type: metadata.regulation_type,
            effective_date: metadata.effective_date,
            priority: metadata.priority || "medium",
            summary: metadata.summary || null,
            scraped_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (docError) {
          results.push({
            success: false,
            error: docError.message,
            metadata,
          })
          continue
        }

        // Chunk and embed
        const chunks = chunkDocument(content, 1000, 200)
        const embeddings = await generateEmbeddings(chunks)

        const embeddingRecords = chunks.map((chunk, idx) => ({
          regulation_id: document.id,
          content: chunk,
          embedding: embeddings[idx],
          chunk_index: idx,
          metadata: {
            total_chunks: chunks.length,
            ...metadata,
          },
        }))

        const { error: embedError } = await supabase.from("regulation_embeddings").insert(embeddingRecords)

        if (embedError) {
          results.push({
            success: false,
            documentId: document.id,
            error: embedError.message,
            metadata,
          })
          continue
        }

        results.push({
          success: true,
          documentId: document.id,
          chunksCreated: chunks.length,
          metadata,
        })
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          metadata: doc.metadata || {},
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failCount = results.length - successCount

    return NextResponse.json({
      total: results.length,
      successful: successCount,
      failed: failCount,
      results,
    })
  } catch (error) {
    console.error("[v0] Batch embed error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
