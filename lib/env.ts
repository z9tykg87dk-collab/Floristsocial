const requiredServerEnvs = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

const optionalServerEnvs = [
  "STRIPE_CONNECT_CLIENT_ID",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "VERCEL_URL",
] as const;

const stripeConnectEnvs = [
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
] as const;

const stripeServerEnvs = ["STRIPE_SECRET_KEY"] as const;

export function getRequiredEnv() {
  return Object.fromEntries(
    requiredServerEnvs.map((key) => [key, process.env[key]])
  ) as Record<(typeof requiredServerEnvs)[number], string | undefined>;
}

export function getMissingRequiredEnv() {
  return requiredServerEnvs.filter((key) => !process.env[key]);
}

export function getOptionalEnv() {
  return Object.fromEntries(
    optionalServerEnvs.map((key) => [key, process.env[key]])
  ) as Record<(typeof optionalServerEnvs)[number], string | undefined>;
}

export function hasRequiredEnv() {
  return getMissingRequiredEnv().length === 0;
}

export function getAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getMissingStripeConnectEnv() {
  return stripeConnectEnvs.filter((key) => !process.env[key]);
}

export function getMissingStripeServerEnv() {
  return stripeServerEnvs.filter((key) => !process.env[key]);
}
