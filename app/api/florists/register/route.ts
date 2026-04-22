import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, password } = body;

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: "Alla fält måste fyllas i" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Lösenordet måste vara minst 8 tecken" },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdminClient();

    const { data: createdUserData, error: createUserError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "florist",
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (createUserError) {
      return NextResponse.json(
        { error: createUserError.message },
        { status: 400 }
      );
    }

    const user = createdUserData.user;

    if (!user) {
      return NextResponse.json(
        { error: "Kunde inte skapa användaren" },
        { status: 500 }
      );
    }

    const { error: roleError } = await admin.from("user_roles").insert({
      id: user.id,
      role: "florist",
    });

    if (roleError) {
      return NextResponse.json(
        { error: `Kunde inte spara roll: ${roleError.message}` },
        { status: 500 }
      );
    }

    const { error: floristError } = await admin.from("florists").insert({
      id: user.id,
      email,
      profile_name: `${firstName} ${lastName}`,
    });

    if (floristError) {
      return NextResponse.json(
        { error: `Kunde inte skapa floristprofil: ${floristError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Floristkonto skapat. Du kan nu logga in.",
    });
  } catch (error) {
    console.error("Florist register error:", error);

    return NextResponse.json(
      { error: "Serverfel vid registrering" },
      { status: 500 }
    );
  }
}
