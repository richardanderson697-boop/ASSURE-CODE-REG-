/**
 * Robots.txt Parser
 * Ethical scraping module that respects robots.txt directives
 */

export interface RobotsTxtRule {
  userAgent: string
  disallow: string[]
  allow: string[]
  crawlDelay?: number
  sitemap?: string[]
}

export class RobotsTxtParser {
  private rules: Map<string, RobotsTxtRule> = new Map()
  private defaultRule: RobotsTxtRule = {
    userAgent: "*",
    disallow: [],
    allow: [],
  }

  constructor(robotsTxtContent: string) {
    this.parse(robotsTxtContent)
  }

  private parse(content: string): void {
    const lines = content.split("\n").map((line) => line.trim())
    let currentUserAgent: string | null = null
    let currentRule: RobotsTxtRule | null = null

    for (const line of lines) {
      // Skip comments and empty lines
      if (line.startsWith("#") || line.length === 0) continue

      const [key, ...valueParts] = line.split(":")
      const value = valueParts.join(":").trim()

      if (!key || !value) continue

      const normalizedKey = key.toLowerCase()

      if (normalizedKey === "user-agent") {
        // Save previous rule if exists
        if (currentUserAgent && currentRule) {
          this.rules.set(currentUserAgent, currentRule)
        }

        // Start new rule
        currentUserAgent = value.toLowerCase()
        currentRule = {
          userAgent: value,
          disallow: [],
          allow: [],
        }
      } else if (currentRule) {
        switch (normalizedKey) {
          case "disallow":
            currentRule.disallow.push(value)
            break
          case "allow":
            currentRule.allow.push(value)
            break
          case "crawl-delay":
            currentRule.crawlDelay = Number.parseFloat(value)
            break
          case "sitemap":
            if (!currentRule.sitemap) currentRule.sitemap = []
            currentRule.sitemap.push(value)
            break
        }
      }
    }

    // Save last rule
    if (currentUserAgent && currentRule) {
      this.rules.set(currentUserAgent, currentRule)
    }

    // Set default rule
    if (this.rules.has("*")) {
      this.defaultRule = this.rules.get("*")!
    }
  }

  /**
   * Check if a URL is allowed to be scraped
   */
  isAllowed(url: string, userAgent = "RegulatoryComplianceBot/1.0"): boolean {
    const pathname = new URL(url).pathname

    // Get applicable rule (specific user-agent or default)
    const rule = this.rules.get(userAgent.toLowerCase()) || this.defaultRule

    // Check allow rules first (they take precedence)
    for (const allowPattern of rule.allow) {
      if (this.matchesPattern(pathname, allowPattern)) {
        return true
      }
    }

    // Check disallow rules
    for (const disallowPattern of rule.disallow) {
      if (this.matchesPattern(pathname, disallowPattern)) {
        return false
      }
    }

    return true
  }

  /**
   * Get crawl delay for a user agent
   */
  getCrawlDelay(userAgent = "RegulatoryComplianceBot/1.0"): number {
    const rule = this.rules.get(userAgent.toLowerCase()) || this.defaultRule
    return rule.crawlDelay || 1 // Default 1 second delay
  }

  private matchesPattern(path: string, pattern: string): boolean {
    // Convert robots.txt pattern to regex
    const regexPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // Escape regex special chars
      .replace(/\*/g, ".*") // * matches any sequence
      .replace(/\$/g, "$") // $ matches end of string

    const regex = new RegExp(`^${regexPattern}`)
    return regex.test(path)
  }

  getSitemaps(): string[] {
    const sitemaps: string[] = []
    for (const rule of this.rules.values()) {
      if (rule.sitemap) {
        sitemaps.push(...rule.sitemap)
      }
    }
    return [...new Set(sitemaps)]
  }
}
