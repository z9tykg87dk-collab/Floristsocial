import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { authenticated: false, error: "Ej inloggad" },
        { status: 401 }
      );
    }

    const { data: florist, error: floristError } = await supabase
      .from("florists")
      .select("id, email, first_name, last_name")
      .eq("id", user.id)
      .maybeSingle();

    if (floristError) {
      return NextResponse.json(
        { authenticated: false, error: "Kunde inte hämta florist" },
        { status: 500 }
      );
    }

    if (!florist) {
      return NextResponse.json(
        { authenticated: false, error: "Ingen floristprofil hittades" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      florist: {
        id: florist.id,
        email: florist.email,
        firstName: florist.first_name,
        lastName: florist.last_name,
      },
    });
  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Serverfel" },
      { status: 500 }
    );
  }
}