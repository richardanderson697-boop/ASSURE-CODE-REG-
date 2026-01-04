/**
 * Curated list of regulatory sources
 * Official government and agency websites for compliance monitoring
 */

export interface RegulatorySource {
  id: string
  name: string
  jurisdiction: "US" | "EU" | "UK" | "Canada"
  baseUrl: string
  category: "financial" | "healthcare" | "privacy" | "environmental" | "general"
  scrapingConfig?: {
    requestsPerMinute?: number
    minDelay?: number
    maxDelay?: number
  }
}

export const REGULATORY_SOURCES: RegulatorySource[] = [
  // United States
  {
    id: "us-sec",
    name: "U.S. Securities and Exchange Commission",
    jurisdiction: "US",
    baseUrl: "https://www.sec.gov",
    category: "financial",
    scrapingConfig: {
      requestsPerMinute: 10,
      minDelay: 2000,
      maxDelay: 4000,
    },
  },
  {
    id: "us-ftc",
    name: "Federal Trade Commission",
    jurisdiction: "US",
    baseUrl: "https://www.ftc.gov",
    category: "privacy",
  },
  {
    id: "us-hhs",
    name: "Department of Health and Human Services",
    jurisdiction: "US",
    baseUrl: "https://www.hhs.gov",
    category: "healthcare",
  },
  {
    id: "us-epa",
    name: "Environmental Protection Agency",
    jurisdiction: "US",
    baseUrl: "https://www.epa.gov",
    category: "environmental",
  },
  {
    id: "us-cfpb",
    name: "Consumer Financial Protection Bureau",
    jurisdiction: "US",
    baseUrl: "https://www.consumerfinance.gov",
    category: "financial",
  },

  // European Union
  {
    id: "eu-gdpr",
    name: "European Data Protection Board",
    jurisdiction: "EU",
    baseUrl: "https://edpb.europa.eu",
    category: "privacy",
  },
  {
    id: "eu-eba",
    name: "European Banking Authority",
    jurisdiction: "EU",
    baseUrl: "https://www.eba.europa.eu",
    category: "financial",
  },
  {
    id: "eu-ema",
    name: "European Medicines Agency",
    jurisdiction: "EU",
    baseUrl: "https://www.ema.europa.eu",
    category: "healthcare",
  },

  // United Kingdom
  {
    id: "uk-ico",
    name: "Information Commissioner's Office",
    jurisdiction: "UK",
    baseUrl: "https://ico.org.uk",
    category: "privacy",
  },
  {
    id: "uk-fca",
    name: "Financial Conduct Authority",
    jurisdiction: "UK",
    baseUrl: "https://www.fca.org.uk",
    category: "financial",
  },

  // Canada
  {
    id: "ca-opc",
    name: "Office of the Privacy Commissioner",
    jurisdiction: "Canada",
    baseUrl: "https://www.priv.gc.ca",
    category: "privacy",
  },
  {
    id: "ca-osfi",
    name: "Office of the Superintendent of Financial Institutions",
    jurisdiction: "Canada",
    baseUrl: "https://www.osfi-bsif.gc.ca",
    category: "financial",
  },
]

export function getSourceById(id: string): RegulatorySource | undefined {
  return REGULATORY_SOURCES.find((source) => source.id === id)
}

export function getSourcesByJurisdiction(jurisdiction: string): RegulatorySource[] {
  return REGULATORY_SOURCES.filter((source) => source.jurisdiction === jurisdiction)
}

export function getSourcesByCategory(category: string): RegulatorySource[] {
  return REGULATORY_SOURCES.filter((source) => source.category === category)
}
