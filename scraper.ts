/**
 * Ethical Web Scraper
 * Main scraping engine with robots.txt compliance and rate limiting
 */

import { RobotsTxtParser } from "./robots-txt-parser"
import { RateLimiter } from "./rate-limiter"

export interface ScraperConfig {
  userAgent: string
  respectRobotsTxt: boolean
  rateLimitConfig?: {
    requestsPerMinute: number
    minDelay: number
    maxDelay: number
  }
}

export interface ScrapeResult {
  url: string
  content: string
  contentType: string
  timestamp: Date
  statusCode: number
  metadata: {
    title?: string
    description?: string
    lastModified?: string
  }
}

export interface ScrapeLog {
  url: string
  timestamp: Date
  allowed: boolean
  reason?: string
  statusCode?: number
}

export class EthicalScraper {
  private config: ScraperConfig
  private rateLimiter: RateLimiter
  private robotsTxtCache: Map<string, RobotsTxtParser> = new Map()
  private logs: ScrapeLog[] = []

  constructor(config: Partial<ScraperConfig> = {}) {
    this.config = {
      userAgent: config.userAgent || "RegulatoryComplianceBot/1.0; +https://assurecode.com/bot.html",
      respectRobotsTxt: config.respectRobotsTxt !== false,
      rateLimitConfig: config.rateLimitConfig,
    }

    this.rateLimiter = new RateLimiter(this.config.rateLimitConfig)
  }

  /**
   * Scrape a URL with ethical considerations
   */
  async scrape(url: string): Promise<ScrapeResult> {
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    console.log(`[v0] Starting scrape for: ${url}`)

    // Check robots.txt
    if (this.config.respectRobotsTxt) {
      const allowed = await this.checkRobotsTxt(url)
      if (!allowed) {
        this.logs.push({
          url,
          timestamp: new Date(),
          allowed: false,
          reason: "Blocked by robots.txt",
        })
        throw new Error(`URL ${url} is disallowed by robots.txt`)
      }
    }

    // Apply rate limiting
    await this.rateLimiter.waitForSlot(domain)

    console.log(`[v0] Rate limit check passed, fetching: ${url}`)

    // Fetch content
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.config.userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      })

      console.log(`[v0] Fetch response status: ${response.status}`)

      if (!response.ok) {
        this.logs.push({
          url,
          timestamp: new Date(),
          allowed: true,
          statusCode: response.status,
        })
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type") || "text/html"
      const content = await response.text()
      const lastModified = response.headers.get("last-modified") || undefined

      // Extract metadata from HTML
      const metadata = this.extractMetadata(content, contentType)
      if (lastModified) {
        metadata.lastModified = lastModified
      }

      this.logs.push({
        url,
        timestamp: new Date(),
        allowed: true,
        statusCode: response.status,
      })

      console.log(`[v0] Successfully scraped: ${url}`)

      return {
        url,
        content,
        contentType,
        timestamp: new Date(),
        statusCode: response.status,
        metadata,
      }
    } catch (error) {
      console.error(`[v0] Scraping error for ${url}:`, error)
      throw error
    }
  }

  /**
   * Check if URL is allowed by robots.txt
   */
  private async checkRobotsTxt(url: string): Promise<boolean> {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    const robotsTxtUrl = `${urlObj.protocol}//${domain}/robots.txt`

    // Check cache first
    let parser = this.robotsTxtCache.get(domain)

    if (!parser) {
      try {
        console.log(`[v0] Fetching robots.txt: ${robotsTxtUrl}`)
        const response = await fetch(robotsTxtUrl, {
          headers: {
            "User-Agent": this.config.userAgent,
          },
        })

        if (response.ok) {
          const content = await response.text()
          parser = new RobotsTxtParser(content)
          this.robotsTxtCache.set(domain, parser)
          console.log(`[v0] Parsed robots.txt for: ${domain}`)
        } else {
          console.log(`[v0] No robots.txt found for: ${domain}, allowing all`)
          // No robots.txt means everything is allowed
          return true
        }
      } catch (error) {
        console.error(`[v0] Error fetching robots.txt:`, error)
        // If we can't fetch robots.txt, allow the request
        return true
      }
    }

    const allowed = parser.isAllowed(url, this.config.userAgent)
    console.log(`[v0] robots.txt check for ${url}: ${allowed ? "ALLOWED" : "BLOCKED"}`)
    return allowed
  }

  /**
   * Extract metadata from HTML content
   */
  private extractMetadata(content: string, contentType: string): { title?: string; description?: string } {
    const metadata: { title?: string; description?: string } = {}

    if (contentType.includes("text/html")) {
      // Extract title
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i)
      if (titleMatch) {
        metadata.title = titleMatch[1].trim()
      }

      // Extract description meta tag
      const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
      if (descMatch) {
        metadata.description = descMatch[1].trim()
      }
    }

    return metadata
  }

  /**
   * Get scraping logs for compliance auditing
   */
  getLogs(): ScrapeLog[] {
    return [...this.logs]
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = []
  }
}
