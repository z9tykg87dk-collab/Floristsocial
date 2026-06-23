import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await req.json();
    const { email, password } = body;

    // Validering
    if (!email || !password) {
      return NextResponse.json(
        { error: "E-post och lösenord krävs" },
        { status: 400 },
      );
    }

    // 🔐 Logga in via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("LOGIN RESULT:");
    console.log("error:", error);
    console.log("has session:", !!data.session);
    console.log("session:", data.session);
    console.log("user:", data.user);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Inloggning misslyckades" },
        { status: 401 },
      );
    }

    // 🌸 Kontrollera att user är florist
    const { data: florist, error: floristError } = await supabase
      .from("florists")
      .select("id, email, first_name, last_name")
      .eq("id" as any, data.user.id)
      .maybeSingle();

    if (floristError) {
      console.error("Florist lookup error:", floristError);
      return NextResponse.json(
        { error: "Kunde inte hämta användare" },
        { status: 500 },
      );
    }

    if (!florist) {
      return NextResponse.json(
        { error: "Endast florister kan logga in här" },
        { status: 403 },
      );
    }

    // ✅ Success
    return NextResponse.json({
      success: true,
      message: "Inloggning lyckades",
      florist: {
        id: florist.id,
        email: florist.email,
        firstName: florist.first_name,
        lastName: florist.last_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Serverfel vid inloggning" },
      { status: 500 },
    );
  }
}
