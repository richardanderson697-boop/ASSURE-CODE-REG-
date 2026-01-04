/**
 * Rate Limiter
 * Implements configurable rate limiting per domain to avoid overloading servers
 */

interface RateLimitConfig {
  requestsPerMinute: number
  minDelay: number // milliseconds
  maxDelay: number // milliseconds
}

interface RequestRecord {
  timestamp: number
  count: number
}

export class RateLimiter {
  private domainRecords: Map<string, RequestRecord[]> = new Map()
  private config: RateLimitConfig

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      requestsPerMinute: config.requestsPerMinute || 30,
      minDelay: config.minDelay || 1000,
      maxDelay: config.maxDelay || 3000,
    }
  }

  /**
   * Wait before making a request to respect rate limits
   */
  async waitForSlot(domain: string): Promise<void> {
    const now = Date.now()
    const records = this.domainRecords.get(domain) || []

    // Clean up old records (older than 1 minute)
    const recentRecords = records.filter((record) => now - record.timestamp < 60000)

    // Check if we've exceeded rate limit
    const totalRequests = recentRecords.reduce((sum, record) => sum + record.count, 0)

    if (totalRequests >= this.config.requestsPerMinute) {
      // Calculate wait time until oldest request expires
      const oldestRecord = recentRecords[0]
      const waitTime = 60000 - (now - oldestRecord.timestamp)
      await this.sleep(Math.max(waitTime, this.config.minDelay))
    } else {
      // Add random delay between minDelay and maxDelay
      const delay = this.config.minDelay + Math.random() * (this.config.maxDelay - this.config.minDelay)
      await this.sleep(delay)
    }

    // Record this request
    recentRecords.push({ timestamp: Date.now(), count: 1 })
    this.domainRecords.set(domain, recentRecords)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Get current request count for a domain
   */
  getRequestCount(domain: string): number {
    const now = Date.now()
    const records = this.domainRecords.get(domain) || []
    const recentRecords = records.filter((record) => now - record.timestamp < 60000)
    return recentRecords.reduce((sum, record) => sum + record.count, 0)
  }
}
