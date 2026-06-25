/**
 * SITE-WIDE CONFIGURATION
 *
 * This is the single source of truth for site identity, contact endpoints,
 * social links, and navigation. Every layout, page, and component MUST
 * import from here - never hardcode these values inline.
 *
 * Every claim-bearing field defaults to null and requires explicit verification
 * by Obaid before shipping to production.
 */

export const siteConfig = {
  // ---- Identity (low-risk structural fields) ----
  name: "Obaid Syed",
  domain: "obaidsyed.com",
  canonicalBaseUrl: "https://obaidsyed.com",

  // ---- Claims (MUST be null until Obaid verifies) ----
  tagline: null as string | null,
  subTagline: null as string | null,

  // ---- Contact endpoints (require REPLACE_ME fill-in before production) ----
  email: "REPLACE_ME@obaidsyed.com",

  // ---- Social links (only list platforms you actively maintain) ----
  social: {
    linkedin: null as string | null,
    github: "https://github.com/diabo205/operations-blog",
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
    formspreeFormId: "REPLACE_ME",
    responseSlaCopy: null as string | null,
    auditSubtitle: null as string | null,
  },

  // ---- Track Record ----
  // All entries start as "unverified". Obaid must explicitly move an entry
  // to "verified" and fill in context/action/result before it ships.
  trackRecord: [
    {
      client: "Eaxeesoft",
      context: null,
      action: null,
      result: null,
      tags: [],
      status: "unverified" as const,
    },
    {
      client: "Eaxee",
      context: null,
      action: null,
      result: null,
      tags: [],
      status: "unverified" as const,
    },
    {
      client: "Red Sea Global",
      context: null,
      action: null,
      result: null,
      tags: [],
      status: "unverified" as const,
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
    { label: "Contact", href: "mailto:REPLACE_ME@obaidsyed.com" },
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
