"use server";

import { getAppUrl, hasRequiredEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SignInState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function signInWithOtpAction(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  if (!hasRequiredEnv()) {
    return {
      status: "error",
      message:
        "Environment variables are missing. Configure Supabase before using sign-in.",
    };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !email.includes("@")) {
    return {
      status: "error",
      message: "Enter a valid email address.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const callbackUrl = new URL("/auth/callback", getAppUrl());

  if (next.startsWith("/")) {
    callbackUrl.searchParams.set("next", next);
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  return {
    status: "success",
    message: "Check your email for the sign-in link.",
  };
}
