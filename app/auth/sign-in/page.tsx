import { SignInForm } from "@/components/auth/sign-in-form";
import { getMissingRequiredEnv } from "@/lib/env";

export default function SignInPage() {
  const missingEnv = getMissingRequiredEnv().filter(
    (key) =>
      key === "NEXT_PUBLIC_SUPABASE_URL" ||
      key === "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
        Authentication
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
        Sign in and role-aware onboarding will live here.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
        Connect this route to Supabase Auth first, then branch onboarding by
        role: florist, private customer, business customer or admin.
      </p>
      {missingEnv.length > 0 ? (
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Missing environment variables: {missingEnv.join(", ")}. Add them in
          `.env.local` before testing auth.
        </div>
      ) : null}
      <SignInForm disabled={missingEnv.length > 0} />
    </main>
  );
}
