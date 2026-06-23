import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address || address.trim().length < 5) {
    return NextResponse.json(
      { error: "Ange en fullständig mottagaradress." },
      { status: 400 }
    );
  }

  const query = `${address}, Sweden`;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=se&q=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "FloristSocial/1.0 nick@makalosablommor.se",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Kunde inte kontakta karttjänsten." },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Kunde inte hitta mottagaradressen." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
      display_name: data[0].display_name,
    });
  } catch {
    return NextResponse.json(
      { error: "Något gick fel vid adressökningen." },
      { status: 500 }
    );
  }
}
