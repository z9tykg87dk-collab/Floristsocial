import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JsonRecord = Record<string, any>;

type UploadedFileInfo = {
  path: string;
  url: string;
  name: string;
  type: string;
  size: number;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function asString(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeSlug(value: string) {
  const base = normalizeSlug(value || "florist");
  return `${base}-${Date.now()}`;
}

function parsePayload(formData: FormData): JsonRecord {
  const rawPayload = formData.get("payload");

  if (!rawPayload || typeof rawPayload !== "string") return {};

  try {
    const parsed = JSON.parse(rawPayload);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
      return parsed;
    return {};
  } catch (error) {
    console.error("Could not parse register payload:", error);
    return {};
  }
}

function getPayloadString(payload: JsonRecord, names: string[], fallback = "") {
  for (const name of names) {
    const value = asString(payload[name]);
    if (value) return value;
  }

  return fallback;
}

function asArray(value: any) {
  return Array.isArray(value) ? value : [];
}

function asObject(value: any) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
}

function maskOrgNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 4) return "XXXXXX-XXXX";
  return `XXXXXX-${trimmed.slice(-4)}`;
}

function buildClosedDates(payload: JsonRecord) {
  const closedHolidayNames = asArray(payload.holidayOverrides)
    .filter((item) => item?.status === "closed")
    .map((item) => item?.name)
    .filter(Boolean);

  const closedCalendarDates = asArray(payload.calendarEvents)
    .filter((item) => item?.status === "closed")
    .map((item) => item?.date)
    .filter(Boolean);

  const seasonalDateRanges = asArray(payload.seasonalClosures)
    .filter((item) => item?.from || item?.to || item?.title || item?.note)
    .map((item) => ({
      type: "seasonal_closure",
      from: item?.from || "",
      to: item?.to || "",
      title: item?.title || "Stängt",
      note: item?.note || "",
    }));

  return [
    ...new Set([
      ...asArray(payload.closedDates).map(String),
      ...closedHolidayNames.map(String),
      ...closedCalendarDates.map(String),
    ]),
    ...seasonalDateRanges,
  ];
}

async function uploadFile(
  bucket: string,
  folder: string,
  file: File | null,
): Promise<UploadedFileInfo | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop() || "bin";
  const safeName =
    file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "upload";

  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error)
    throw new Error(`Storage upload failed for ${file.name}: ${error.message}`);

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return {
    path,
    url: data.publicUrl,
    name: file.name,
    type: file.type,
    size: file.size,
  };
}

function mapServicePortfolioWithUploads(
  servicePortfolioItems: Record<string, any[]>,
  uploadByFileKey: Record<string, UploadedFileInfo | null>,
) {
  const result: Record<string, any[]> = {};

  Object.entries(servicePortfolioItems).forEach(([serviceName, items]) => {
    result[serviceName] = asArray(items)
      .filter((item) => item?.isSaved)
      .map((item) => ({
        serviceName,
        title: item.title || "",
        price: item.price || "",
        description: item.description || "",
        hashtags: item.hashtags || "",
        mediaType: item.mediaType || "image",
        fileKey: item.fileKey || null,
        image: item.fileKey ? uploadByFileKey[item.fileKey] || null : null,
        url: item.fileKey ? uploadByFileKey[item.fileKey]?.url || null : null,
      }));
  });

  return result;
}

function mapGeneralPortfolioWithUploads(
  items: any[],
  uploadByFileKey: Record<string, UploadedFileInfo | null>,
) {
  return asArray(items)
    .filter((item) => item?.isSaved)
    .map((item) => ({
      serviceName: item.serviceName || "Allmän portfolio",
      title: item.title || "",
      price: item.price || "",
      description: item.description || "",
      hashtags: item.hashtags || "",
      mediaType: item.mediaType || "image",
      fileKey: item.fileKey || null,
      image: item.fileKey ? uploadByFileKey[item.fileKey] || null : null,
      url: item.fileKey ? uploadByFileKey[item.fileKey]?.url || null : null,
    }));
}

function flattenPortfolioImages(
  servicePortfolioItems: Record<string, any[]>,
  generalPortfolioItems: any[],
) {
  const serviceImages = Object.values(servicePortfolioItems)
    .flat()
    .filter((item) => item?.url || item?.image?.url);

  const generalImages = asArray(generalPortfolioItems).filter(
    (item) => item?.url || item?.image?.url,
  );

  return [...serviceImages, ...generalImages];
}

export async function POST(request: NextRequest) {
  let authUserId: string | null = null;

  try {
    const formData = await request.formData();
    const payload = parsePayload(formData);

    console.log("REGISTER FORM KEYS:", Array.from(formData.keys()));
    console.log("REGISTER PAYLOAD KEYS:", Object.keys(payload));
    console.log("REGISTER PAYLOAD:", payload);

    const ownerEmail = getPayloadString(payload, ["ownerEmail", "email"]);
    const publicEmail = getPayloadString(
      payload,
      ["publicEmail", "shopEmail"],
      ownerEmail,
    );
    const password = getPayloadString(payload, ["password"]);
    const shopName = getPayloadString(
      payload,
      ["shopName"],
      ownerEmail.split("@")[0] || "Florist",
    );
    const firstName = getPayloadString(payload, ["firstName"]);
    const lastName = getPayloadString(payload, ["lastName"]);

    if (!ownerEmail) {
      return NextResponse.json(
        {
          error: "E-post saknas.",
          receivedPayloadKeys: Object.keys(payload),
          receivedPayload: payload,
        },
        { status: 400 },
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Lösenord saknas eller är för kort. Minst 8 tecken krävs." },
        { status: 400 },
      );
    }

    const slug = makeSlug(shopName);
    const bucket = "florist-portfolio";

    const uploadByFileKey: Record<string, UploadedFileInfo | null> = {};
    const portfolioFileEntries = Array.from(formData.entries()).filter(
      ([key, value]) =>
        key.startsWith("portfolioFile_") &&
        value instanceof File &&
        value.size > 0,
    ) as [string, File][];

    for (const [fileKey, file] of portfolioFileEntries) {
      uploadByFileKey[fileKey] = await uploadFile(
        bucket,
        `${slug}/portfolio`,
        file,
      );
    }

    const profileUpload = await uploadFile(
      bucket,
      `${slug}/profile`,
      formData.get("profileImage") instanceof File
        ? (formData.get("profileImage") as File)
        : null,
    );

    const logoUpload = await uploadFile(
      bucket,
      `${slug}/logo`,
      formData.get("logo") instanceof File
        ? (formData.get("logo") as File)
        : null,
    );

    const coverUpload = await uploadFile(
      bucket,
      `${slug}/cover`,
      formData.get("coverImage") instanceof File
        ? (formData.get("coverImage") as File)
        : null,
    );

    const servicePortfolioItems = mapServicePortfolioWithUploads(
      asObject(payload.servicePortfolioItems),
      uploadByFileKey,
    );

    const generalPortfolioItems = mapGeneralPortfolioWithUploads(
      asArray(payload.generalPortfolioItems),
      uploadByFileKey,
    );

    const portfolioImages = flattenPortfolioImages(
      servicePortfolioItems,
      generalPortfolioItems,
    );

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: ownerEmail,
        password,
        email_confirm: true,
        user_metadata: {
          role: "florist",
          shop_name: shopName,
          public_email: publicEmail,
          slug,
        },
      });

    if (authError || !authUser.user) {
      return NextResponse.json(
        {
          error:
            authError?.message ||
            "Kunde inte skapa användare i Authentication.",
        },
        { status: 400 },
      );
    }

    authUserId = authUser.user.id;

    const organizationNumber = getPayloadString(payload, [
      "organizationNumber",
    ]);
    const closedDates = buildClosedDates(payload);
    const holidayOverrides = asArray(payload.holidayOverrides);
    const calendarEvents = asArray(payload.calendarEvents);
    const seasonalClosures = asArray(payload.seasonalClosures);

    const floristPayload: JsonRecord = {
      id: authUser.user.id,
      email: publicEmail,
      owner_email: ownerEmail,
      public_email: publicEmail,
      first_name: firstName || null,
      last_name: lastName || null,
      shop_name: shopName,
      legal_business_name: getPayloadString(payload, ["legalBusinessName"]),
      organization_number: organizationNumber,
      masked_organization_number: getPayloadString(
        payload,
        ["maskedOrganizationNumber"],
        maskOrgNumber(organizationNumber),
      ),
      role: "florist",
      external_place_id:
        getPayloadString(payload, [
          "externalPlaceId",
          "external_place_id",
          "googlePlaceId",
          "google_place_id",
        ]) || null,
      claim_status: "CLAIM_PENDING",
      verification_level: "NONE",
      profile_name: slug,
      slug,
      florist_name: shopName,
      bio: getPayloadString(payload, ["bio"], "Florist på FloristSocial 🌸"),
      description: getPayloadString(payload, ["bio"]),
      is_active: true,
      phone: getPayloadString(payload, ["shopPhone", "phone"]),
      owner_phone: getPayloadString(payload, ["ownerPhone"]),
      website: getPayloadString(payload, ["websiteUrl"]),
      instagram: getPayloadString(payload, ["instagramHandle"]),
      address_line_1: getPayloadString(payload, ["streetAddress"]),
      address_line_2: getPayloadString(payload, ["addressLine2"]),
      postal_code: getPayloadString(payload, ["postalCode"]),
      city: getPayloadString(payload, ["city"]),
      municipality: getPayloadString(payload, ["municipality"]),
      county: getPayloadString(payload, ["county"]),
      country: getPayloadString(payload, ["country", "countryName"], "Sverige"),
      delivery_model: getPayloadString(payload, ["deliveryModel"]),
      delivery_radius_km: payload.deliveryRadiusKm ?? null,
      delivery_areas: asArray(payload.coverageAreas),
      services: asArray(payload.selectedServices),
      styles: asArray(payload.selectedStyles),
      price_level: getPayloadString(payload, ["priceLevel"]),
      minimum_booking_value: getPayloadString(payload, [
        "minimumOrderValue",
        "minimumBookingValue",
      ]),
      years_in_business: getPayloadString(payload, ["yearsInBusiness"]),
      team_size: getPayloadString(payload, ["teamSize"]),
      opening_hours: asArray(payload.openingHours),
      holiday_overrides: holidayOverrides,
      calendar_events: calendarEvents,
      seasonal_closures: seasonalClosures,
      closed_dates: closedDates,
      service_portfolio_items: servicePortfolioItems,
      general_portfolio_items: generalPortfolioItems,
      portfolio_images: portfolioImages,
      stripe_account_id: getPayloadString(payload, ["stripeAccountId"]),
      economy_settings: asObject(payload.economySettings),
      status: getPayloadString(payload, ["status"], "Ny ansökan"),
      plan: getPayloadString(payload, ["plan"], "Free"),
      admin_owner: getPayloadString(payload, ["adminOwner"]),
      admin_note: getPayloadString(payload, ["adminNote"]),
      edit_policy: payload.editPolicy || null,
      profile_image_url: profileUpload?.url || "https://placehold.co/100x100",
      profile_image_path: profileUpload?.path || null,
      logo_url: logoUpload?.url || null,
      logo_path: logoUpload?.path || null,
      cover_image_url: coverUpload?.url || null,
      cover_image_path: coverUpload?.path || null,
      updated_at: new Date().toISOString(),
    };

    const { data: florist, error: floristError } = await supabaseAdmin
      .from("florists")
      .insert(floristPayload)
      .select("*")
      .single();

    if (floristError) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      authUserId = null;

      return NextResponse.json(
        {
          error: "Användaren skapades, men floristprofilen kunde inte sparas.",
          details: floristError.message,
          hint: "Kontrollera att nya kolumner finns i florists-tabellen: holiday_overrides, calendar_events och seasonal_closures.",
          attemptedPayloadKeys: Object.keys(floristPayload),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        florist,
        floristId: florist.id,
        slug: florist.slug,
        profileUrl: `/florist/${florist.id}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Florist registration error:", error);

    if (authUserId) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId).catch(() => null);
    }

    return NextResponse.json(
      {
        error: "Registreringen misslyckades.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
