/**
 * SITE-WIDE CONFIGURATION
 *
 * This is the single source of truth for site identity, contact endpoints,
 * social links, and navigation. Every layout, page, and component MUST
 * import from here - never hardcode these values inline.
 */

export const siteConfig = {
  // ---- Identity ----
  name: "Obaid Syed",
  domain: "obaidsyed.com",
  canonicalBaseUrl: "https://obaidsyed.com",
  tagline: "Digital sales infrastructure for technical business platforms",
  subTagline:
    "Translating complex enterprise architecture into high-velocity sales pipelines.",

  // ---- Contact endpoints ----
  email: "test@example.com",

  // ---- Social links (only list platforms you actively maintain) ----
  social: {
    linkedin: "https://www.linkedin.com/in/test-profile",
    github: "https://github.com/diabo205/operations-blog",
    twitter: null as string | null,
    mastodon: null as string | null,
  },

  // ---- Scheduling (Track B - Executive Briefing) ----
  scheduling: {
    provider: "cal.com" as "cal.com" | "calendly",
    url: "https://cal.com/test",
  },

  // ---- Form backend (Track A - Infrastructure Audit) ----
  forms: {
    provider: "formspree" as "formspree" | "netlify" | "vercel",
    formspreeFormId: "test-form-id",
  },

  // ---- Track Record micro-case studies ----
  trackRecord: [
    {
      client: "Eaxeesoft",
      context:
        "Odoo Gold Partner scaling outbound pipeline across 12 regional verticals.",
      action:
        "Rebuilt CRM-to-Odoo sync layer; replaced manual lead routing with deterministic architecture-map-based assignment.",
      result:
        "34% reduction in lead-to-opportunity latency; 2.1x increase in qualified pipeline within 90 days.",
      tags: ["Odoo", "CRM Integration", "Pipeline Architecture"],
    },
    {
      client: "Eaxee",
      context:
        "Enterprise Architecture Management platform targeting Global 2000 CIOs.",
      action:
        "Repositioned technical capability docs as executive readiness assessments; structured pricing around architecture maturity tiers.",
      result:
        "Average deal size moved from $18K to $94K; sales cycle shortened from 71 to 38 days.",
      tags: ["EAM", "Positioning", "Pricing Architecture"],
    },
    {
      client: "Red Sea Global",
      context:
        "Regenerative tourism developer requiring enterprise software governance at $9B project scale.",
      action:
        "Architected vendor evaluation framework spanning 14 enterprise systems; directed data integrity audits across procurement and asset management.",
      result:
        "Resolved 3 systemic data drift incidents; standardized 11 integration contracts; achieved audit-ready status ahead of Phase 1 launch.",
      tags: ["EAM", "Data Integrity", "Governance"],
    },
  ] as Array<{
    client: string;
    context: string;
    action: string;
    result: string;
    tags: string[];
  }>,

  // ---- Primary navigation ----
  nav: [
    { label: "Work", href: "/#track-record" },
    { label: "Writing", href: "/blog" },
    { label: "Audit", href: "/#track-a" },
    { label: "Briefing", href: "/#track-b" },
    { label: "Contact", href: "mailto:test@example.com" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
