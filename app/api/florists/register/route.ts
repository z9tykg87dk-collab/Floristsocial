import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNumberOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const cleaned = String(value).replace(/[^\d]/g, "");
  if (!cleaned) return null;

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      firstName,
      lastName,
      password,
      shopName,
      phone,
      city,
      postalCode,
      streetAddress,
      websiteUrl,
      instagramHandle,
      bio,
      deliveryRadiusKm,
      stripeAccountId,
      selectedServices = [],
      coverageAreas = [],
      servicePortfolioItems = {},
      closedDates = [],
      priceLevel,
      minimumEventPrice,
    } = body;

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: "Förnamn, efternamn, e-post och lösenord måste fyllas i." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Lösenordet måste vara minst 8 tecken." },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdminClient();

    const fullName = (firstName + " " + lastName).trim();
    const finalShopName = shopName?.trim() || fullName;
    const slugBase = createSlug(finalShopName || "florist");
    const slug = slugBase + "-" + Date.now();

    const { data: createdUserData, error: createUserError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "florist",
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
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
        { error: "Kunde inte skapa användaren." },
        { status: 500 }
      );
    }

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
        phone: phone || null,
        city: city || null,
        company_name: finalShopName,
        country_code: "SE",
        role: "florist",
        is_active: true,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return NextResponse.json(
        { error: "Kunde inte skapa/uppdatera profil: " + profileError.message },
        { status: 500 }
      );
    }

    const { data: floristProfile, error: floristProfileError } = await admin
      .from("florist_profiles")
      .insert({
        profile_id: user.id,
        shop_name: finalShopName,
        slug,
        city: city || "Ej angivet",
        country_code: "SE",
        email,
        phone: phone || null,
        postal_code: postalCode || null,
        street_address: streetAddress || null,
        website_url: websiteUrl || null,
        instagram_handle: instagramHandle || null,
        bio: bio || null,
        delivery_radius_km: deliveryRadiusKm ? Number(deliveryRadiusKm) : null,
        stripe_account_id: stripeAccountId || null,
        stripe_onboarding_complete: false,
        accepts_referrals: true,
        fulfills_orders: true,
        onboarding_completed_at: null,
      })
      .select("id, slug")
      .single();

    if (floristProfileError || !floristProfile) {
      return NextResponse.json(
        {
          error:
            "Kunde inte skapa floristprofil: " +
            (floristProfileError?.message || "Okänt fel"),
        },
        { status: 500 }
      );
    }

    const floristProfileId = floristProfile.id;

    if (Array.isArray(coverageAreas) && coverageAreas.length > 0) {
      const deliveryRows = coverageAreas
        .filter((area: any) => area?.city || area?.area || area?.postalCode)
        .map((area: any) => ({
          florist_profile_id: floristProfileId,
          city: area.city || city || "Ej angivet",
          area: area.area || null,
          postal_code: area.postalCode || null,
          radius_km: area.radius ? Number(area.radius) : null,
          delivery_price_amount: toNumberOrNull(area.price),
        }));

      if (deliveryRows.length > 0) {
        const { error: deliveryError } = await admin
          .from("florist_delivery_areas")
          .insert(deliveryRows);

        if (deliveryError) {
          return NextResponse.json(
            {
              error:
                "Kunde inte spara leveransområden: " + deliveryError.message,
            },
            { status: 500 }
          );
        }
      }
    }

    if (Array.isArray(selectedServices) && selectedServices.length > 0) {
      const serviceRows = selectedServices.map((serviceName: string) => ({
        florist_profile_id: floristProfileId,
        service_name: serviceName,
        price_level: priceLevel || null,
        minimum_price_amount: toNumberOrNull(minimumEventPrice),
        description: null,
        is_active: true,
      }));

      const { error: servicesError } = await admin
        .from("florist_services")
        .insert(serviceRows);

      if (servicesError) {
        return NextResponse.json(
          { error: "Kunde inte spara tjänster: " + servicesError.message },
          { status: 500 }
        );
      }
    }

    const portfolioRows: any[] = [];

    if (servicePortfolioItems && typeof servicePortfolioItems === "object") {
      Object.entries(servicePortfolioItems).forEach(([serviceName, items]) => {
        if (!Array.isArray(items)) return;

        items.forEach((item: any) => {
          if (!item?.isSaved) return;

          portfolioRows.push({
            florist_profile_id: floristProfileId,
            service_name: serviceName,
            title: item.title || serviceName,
            description: item.description || null,
            price_amount: toNumberOrNull(item.price),
            hashtags: item.hashtags || null,
            media_url: item.mediaUrl || null,
            media_type: item.mediaType || "image",
            is_public: true,
          });
        });
      });
    }

    if (portfolioRows.length > 0) {
      const { error: portfolioError } = await admin
        .from("florist_portfolio_items")
        .insert(portfolioRows);

      if (portfolioError) {
        return NextResponse.json(
          {
            error:
              "Kunde inte spara portfolio-bilder: " + portfolioError.message,
          },
          { status: 500 }
        );
      }
    }

    if (Array.isArray(closedDates) && closedDates.length > 0) {
      const closedRows = closedDates.map((item: string) => {
        const isDate = /^\d{4}-\d{2}-\d{2}$/.test(item);

        return {
          florist_profile_id: floristProfileId,
          closed_label: item,
          closed_date: isDate ? item : null,
          reason: isDate ? "Stängd dag" : "Svensk helgdag",
        };
      });

      const { error: closedDaysError } = await admin
        .from("florist_closed_days")
        .insert(closedRows);

      if (closedDaysError) {
        return NextResponse.json(
          {
            error:
              "Kunde inte spara stängda dagar: " + closedDaysError.message,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Floristkonto skapat. Du kan nu logga in.",
      userId: user.id,
      floristProfileId,
      slug: floristProfile.slug,
    });
  } catch (error) {
    console.error("Florist register error:", error);

    return NextResponse.json(
      { error: "Serverfel vid registrering." },
      { status: 500 }
    );
  }
}

