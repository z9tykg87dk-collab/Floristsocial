export const roles = [
  "florist",
  "private_customer",
  "business_customer",
  "admin",
] as const;

export const appShellLinks = [
  {
    href: "/auth/sign-in",
    eyebrow: "Phase 1",
    title: "Authentication and role system",
    description:
      "Supabase Auth, profile bootstrap and role-based onboarding flows.",
  },
  {
    href: "/onboarding/florist",
    eyebrow: "Phase 1",
    title: "Florist onboarding",
    description:
      "Create the florist role and public shop profile before products and payouts.",
  },
  {
    href: "/directory",
    eyebrow: "Phase 1",
    title: "Florist directory",
    description:
      "Public discovery surface for browsing florist profiles and delivery areas.",
  },
  {
    href: "/marketplace",
    eyebrow: "Phase 2",
    title: "Marketplace and checkout",
    description:
      "Products, cart, checkout, order creation and Stripe payment handoff.",
  },
  {
    href: "/dashboard",
    eyebrow: "Phase 4",
    title: "Florist dashboard",
    description:
      "Operational surface for products, orders, Stripe Connect and payouts.",
  },
  {
    href: "/admin",
    eyebrow: "Phase 4",
    title: "Admin overview",
    description:
      "Core oversight for onboarding, transactions, disputes and system state.",
  },
  {
    href: "/setup",
    eyebrow: "Ops",
    title: "Setup and health",
    description:
      "Deployment-readiness checks for env vars, Supabase and Stripe.",
  },
  {
    href: "/feed",
    eyebrow: "Phase 5",
    title: "Social feed",
    description:
      "Posts, likes, comments and following for the first social layer.",
  },
] as const;

export const buildPhases = [
  {
    name: "Phase 0",
    title: "Foundation",
    items: [
      "GitHub repository",
      "Vercel project",
      "Supabase project",
      "Environment variables",
      "Base Next.js app structure",
    ],
  },
  {
    name: "Phase 1",
    title: "Core platform",
    items: [
      "Authentication",
      "Role system",
      "User and florist profiles",
      "Florist onboarding",
      "Homepage",
      "Florist directory",
    ],
  },
  {
    name: "Phase 2-5",
    title: "Commerce and social",
    items: [
      "Marketplace and checkout",
      "Stripe Connect split logic",
      "Florist workflow",
      "Admin controls",
      "Basic social feed",
    ],
  },
] as const;
