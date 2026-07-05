import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/database.types";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createServerClient<Database, "public">(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: florist } = await supabase
      .from("florists")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (florist?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

    if (pathname.startsWith("/shop")) {
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const { data: florist } = await supabase
        .from("florists")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (florist?.role !== "customer") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/login") && user) {
    const { data: florist } = await supabase
      .from("florists")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (florist?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
