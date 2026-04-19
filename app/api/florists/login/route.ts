import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-post och lösenord krävs" },
        { status: 400 }
      );
    }

    const { data: florist, error } = await supabase
      .from("florists")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Kunde inte hämta användare" },
        { status: 500 }
      );
    }

    if (!florist) {
      return NextResponse.json(
        { error: "Fel e-post eller lösenord" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, florist.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Fel e-post eller lösenord" },
        { status: 401 }
      );
    }

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
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "Serverfel" },
      { status: 500 }
    );
  }
}
