import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, firstName, lastName, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-post och lösenord krävs" },
        { status: 400 }
      );
    }

    // 🚫 Kolla om email redan finns
    const { data: existingFlorist, error: existingError } = await supabase
      .from("florists")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: "Kunde inte kontrollera befintlig e-post" },
        { status: 500 }
      );
    }

    if (existingFlorist) {
      return NextResponse.json(
        { error: "E-postadressen används redan" },
        { status: 409 }
      );
    }

    // 🔐 Hasha lösenord
    const hashedPassword = await bcrypt.hash(password, 12);

    // 💾 Spara i databasen
    const { error } = await supabase.from("florists").insert([
      {
        email,
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: `Kunde inte spara i databasen: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Florist registrerad",
    });
  } catch (error) {
    console.error("Register route error:", error);
    return NextResponse.json(
      { error: "Serverfel" },
      { status: 500 }
    );
  }
}
