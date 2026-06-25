/**
 * SITE-WIDE CONFIGURATION
 *
 * This is the single source of truth for site identity, contact endpoints,
 * social links, and navigation. Every layout, page, and component MUST
 * import from here - never hardcode these values inline.
 *
 * Every claim-bearing field defaults to null and requires explicit verification
 * by Obaid before shipping to production. All values below were provided by
 * Obaid in obaid-intake-completed.md (Phase 3 intake form).
 */

export const siteConfig = {
  // ---- Identity (verified by Obaid 2026-06-25) ----
  name: "Obaid Syed",
  domain: "obaidsyed.com",
  canonicalBaseUrl: "https://obaidsyed.com",
  tagline: "I build evidence-based GTM systems for B2B software companies.",
  subTagline: "You get a validated ICP, productized offers, and a repeatable system that fills your pipeline.",

  // ---- Contact endpoints (verified by Obaid 2026-06-25) ----
  email: "obaid@glyphicx.com",

  // ---- Social links (verified by Obaid 2026-06-25) ----
  social: {
    linkedin: "https://www.linkedin.com/in/obaidsayyed/",
    github: "https://github.com/diabo205",
    twitter: null as string | null,
    mastodon: null as string | null,
  },

  // ---- Scheduling (Track B - Executive Briefing) ----
  scheduling: {
    provider: "cal.com" as "cal.com" | "calendly",
    url: null as string | null,
    durationLabel: null as string | null,
    agenda: [] as Array<{ item: string; minutes: number }>,
    briefingSubtitle: null as string | null,
  },

  // ---- Form backend (Track A - Infrastructure Audit) ----
  forms: {
    provider: "formspree" as "formspree" | "netlify" | "vercel",
    formspreeFormId: null as string | null,
    responseSlaCopy: null as string | null,
    auditSubtitle: null as string | null,
  },

  // ---- Track Record (verified by Obaid 2026-06-25) ----
  // All entries start as "unverified". Obaid must explicitly move an entry
  // to "verified" and fill in context/action/result before it ships.
  trackRecord: [
    {
      client: "Academix",
      context: "Academix needed a defensible total addressable market across its three priority geographies — Pakistan, Saudi Arabia, and UAE — to replace fragmented, manually-unresolvable accreditation data with a governance-classified target list.",
      action: "Built and ran a multi-stage TAM pipeline (eligibility screening, wave classification, enrollment verification, OBE-relevance filtering) across all three markets, resolving the Pakistan HEC data gap manually where automated sourcing failed.",
      result: "Delivered a defensible TAM of 185 qualifying institutions across Pakistan, UAE, and Saudi Arabia, classified into 159 Wave 1 (founder-controlled) and 26 Wave 2 (board-governed) targets — giving Academix a verified prospect base to build outreach against. Productization and downstream sales execution remain in progress.",
      tags: ["TAM Analysis", "Market Sizing", "Governance Classification", "Academix", "Higher Education"],
      status: "verified" as const,
    },
    {
      client: "Eaxee",
      context: "Eaxee needed its website rebuilt to match international B2B SaaS competitors like Ardoq and LeanIX, alongside consistent LinkedIn content production to support enterprise positioning.",
      action: "Scoped a full website redesign — competitor UI/UX analysis, CMS setup, value-led copywriting, SEO optimisation, CRM-integrated demo funnels — plus a monthly retainer producing 8 LinkedIn posts per cycle; contract signed and build currently in progress.",
      result: "Engagement signed and active; website redesign and first content retainer cycle are in progress.",
      tags: ["Website Redesign", "B2B SaaS Positioning", "CMS", "LinkedIn Content", "CRM Integration"],
      status: "verified" as const,
    },
  ] as Array<{
    client: string;
    context: string | null;
    action: string | null;
    result: string | null;
    tags: string[];
    status: "verified" | "unverified";
  }>,

  // ---- Navigation ----
  nav: [
    { label: "Work", href: "/#track-record" },
    { label: "Writing", href: "/blog" },
    { label: "Audit", href: "/#track-a" },
    { label: "Briefing", href: "/#track-b" },
    { label: "Contact", href: "mailto:obaid@glyphicx.com" },
  ],
} as const;

// ---- Build-time guards ----
const REPLACE_ME_PATTERN = /REPLACE_ME/;

function findPlaceholders(obj: unknown, path = ""): string[] {
  const offenders: string[] = [];
  if (typeof obj === "string") {
    if (REPLACE_ME_PATTERN.test(obj)) offenders.push(`${path} = "${obj}"`);
  } else if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => offenders.push(...findPlaceholders(item, `${path}[${i}]`)));
    } else {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        offenders.push(...findPlaceholders(v, path ? `${path}.${k}` : k));
      }
    }
  }
  return offenders;
}

if (import.meta.env.PROD) {
  // Guard 1: REPLACE_ME placeholders
  const offenders = findPlaceholders(siteConfig);
  if (offenders.length > 0) {
    console.error(
      "\n🚫 PRODUCTION BUILD BLOCKED - placeholder values:\n" +
        offenders.map((o) => `   - ${o}`).join("\n") +
        "\n\nFill in src/config/site.ts before deploying.\n"
    );
    throw new Error("Refusing to build: site config contains REPLACE_ME placeholders.");
  }

  // Guard 2: Verified track record entries must be complete
  const incompleteVerified = siteConfig.trackRecord.filter(
    (entry) =>
      (entry as { status?: string }).status === "verified" &&
      (entry.context === null || entry.action === null || entry.result === null)
  );
  if (incompleteVerified.length > 0) {
    console.error(
      "\n🚫 PRODUCTION BUILD BLOCKED - verified track record entries missing fields:\n" +
        incompleteVerified.map((e) => `   - ${e.client}`).join("\n") +
        "\n\nEither fill in context/action/result or set status to 'unverified'.\n"
    );
    throw new Error("Refusing to build: verified track record entries are incomplete.");
  }

  // Guard 3: Production build is allowed to ship with unverified track record
  // entries (they render as "Pending verification"), but emit a warning
  const unverifiedEntries = siteConfig.trackRecord.filter(
    (e) => (e as { status?: string }).status === "unverified"
  );
  if (unverifiedEntries.length > 0) {
    console.warn(
      "\n⚠️  PRODUCTION BUILD WARNING - shipping with " +
        unverifiedEntries.length +
        " unverified track record entries:\n" +
        unverifiedEntries.map((e) => `   - ${e.client}`).join("\n") +
        "\nThese will render as 'Pending verification' on the live site.\n"
    );
  }

  // Guard 4: Block production build if tagline or subTagline is null
  if (siteConfig.tagline === null || siteConfig.subTagline === null) {
    console.error(
      "\n🚫 PRODUCTION BUILD BLOCKED - core identity copy is missing:\n" +
      (siteConfig.tagline === null ? "   - siteConfig.tagline is null\n" : "") +
      (siteConfig.subTagline === null ? "   - siteConfig.subTagline is null\n" : "") +
      "\nProvide values in src/config/site.ts.\n"
    );
    throw new Error("Refusing to build: core identity copy is unverified.");
  }
}

export type SiteConfig = typeof siteConfig;
