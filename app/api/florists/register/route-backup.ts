import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JsonRecord = Record<string, any>;

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

function parsePayload(formData: FormData): JsonRecord {
  const rawPayload = formData.get("payload");

  if (!rawPayload || typeof rawPayload !== "string") return {};

  try {
    const parsed = JSON.parse(rawPayload);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as JsonRecord;
    }
    return {};
  } catch (error) {
    console.error("Could not parse register payload:", error);
    return {};
  }
}

function getNestedValue(source: any, path: string) {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) return acc[key];
    return undefined;
  }, source);
}

function getValue(payload: JsonRecord, formData: FormData, names: string[]) {
  for (const name of names) {
    const directFormValue = asString(formData.get(name));
    if (directFormValue) return directFormValue;

    const directPayloadValue = asString(payload[name]);
    if (directPayloadValue) return directPayloadValue;

    const nestedPayloadValue = asString(getNestedValue(payload, name));
    if (nestedPayloadValue) return nestedPayloadValue;
  }

  return "";
}

function flattenValues(input: any): string[] {
  const values: string[] = [];

  function walk(value: any) {
    if (value === null || value === undefined) return;

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      values.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (typeof value === "object") {
      Object.values(value).forEach(walk);
    }
  }

  walk(input);
  return values;
}

function findEmail(payload: JsonRecord, formData: FormData) {
  const names = [
    "email",
    "mail",
    "eMail",
    "account.email",
    "auth.email",
    "user.email",
    "owner.email",
    "contact.email",
    "contactEmail",
    "contact_email",
    "businessEmail",
    "business_email",
    "ownerEmail",
    "owner_email",
    "personalEmail",
    "personal_email",
    "accountEmail",
    "account_email",
    "userEmail",
    "user_email",
    "loginEmail",
    "login_email",
  ];

  const known = getValue(payload, formData, names);
  if (known) return known;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const formValues = Array.from(formData.values()).map(asString);
  const payloadValues = flattenValues(payload);
  const found = [...formValues, ...payloadValues].find((value) => emailRegex.test(value.trim()));

  return found?.trim() || "";
}

function findPassword(payload: JsonRecord, formData: FormData) {
  const names = [
    "password",
    "account.password",
    "auth.password",
    "user.password",
    "confirmPassword",
    "accountPassword",
    "account_password",
    "newPassword",
    "new_password",
    "losenord",
    "lösenord",
  ];

  const known = getValue(payload, formData, names);
  if (known) return known;

  function scanObject(obj: any): string {
    if (!obj || typeof obj !== "object") return "";

    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const text = asString(value);

      if (
        text.length >= 6 &&
        (lowerKey.includes("password") || lowerKey.includes("losenord") || lowerKey.includes("lösenord"))
      ) {
        return text;
      }

      if (value && typeof value === "object") {
        const nested = scanObject(value);
        if (nested) return nested;
      }
    }

    return "";
  }

  const payloadPassword = scanObject(payload);
  if (payloadPassword) return payloadPassword;

  for (const [key, value] of formData.entries()) {
    const lowerKey = key.toLowerCase();
    const text = asString(value);

    if (
      text.length >= 6 &&
      (lowerKey.includes("password") || lowerKey.includes("losenord") || lowerKey.includes("lösenord"))
    ) {
      return text;
    }
  }

  return "";
}

function getJsonValue(payload: JsonRecord, formData: FormData, names: string[], fallback: any) {
  for (const name of names) {
    const formValue = formData.get(name);

    if (formValue && typeof formValue === "string") {
      try {
        return JSON.parse(formValue);
      } catch {
        return formValue;
      }
    }

    const payloadValue = payload[name] ?? getNestedValue(payload, name);
    if (payloadValue !== undefined && payloadValue !== null) return payloadValue;
  }

  return fallback;
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

async function uploadFile(bucket: string, folder: string, file: File | null) {
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

  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) throw new Error(`Storage upload failed for ${file.name}: ${error.message}`);

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return {
    path,
    url: data.publicUrl,
    name: file.name,
    type: file.type,
    size: file.size,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const payload = parsePayload(formData);

    console.log("REGISTER FORM KEYS:", Array.from(formData.keys()));
    console.log("REGISTER PAYLOAD KEYS:", Object.keys(payload));
    console.log("REGISTER PAYLOAD:", payload);

    const email = findEmail(payload, formData);
    const password = findPassword(payload, formData);

    const firstName = getValue(payload, formData, [
      "firstName",
      "first_name",
      "firstname",
      "fornamn",
      "förnamn",
      "owner.firstName",
      "owner.first_name",
    ]);

    const lastName = getValue(payload, formData, [
      "lastName",
      "last_name",
      "lastname",
      "efternamn",
      "owner.lastName",
      "owner.last_name",
    ]);

    const shopName =
      getValue(payload, formData, [
        "shopName",
        "shop_name",
        "businessName",
        "business_name",
        "floristName",
        "florist_name",
        "name",
        "displayName",
        "display_name",
        "store.name",
        "business.name",
      ]) || `${firstName} ${lastName}`.trim() || email.split("@")[0];

    if (!email) {
      return NextResponse.json(
        {
          error: "E-post saknas.",
          receivedFormKeys: Array.from(formData.keys()),
          receivedPayloadKeys: Object.keys(payload),
          receivedPayload: payload,
        },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          error: "Lösenord saknas eller är för kort.",
          receivedFormKeys: Array.from(formData.keys()),
          receivedPayloadKeys: Object.keys(payload),
        },
        { status: 400 }
      );
    }

    const slug = makeSlug(shopName);
    const bucket = "florist-portfolio";
    const logoFile = formData.get("logo") instanceof File ? (formData.get("logo") as File) : null;
    const coverFile = formData.get("coverImage") instanceof File ? (formData.get("coverImage") as File) : null;
    const profileFile = formData.get("profileImage") instanceof File ? (formData.get("profileImage") as File) : null;

    const portfolioFiles = [
      ...formData.getAll("portfolio"),
      ...formData.getAll("portfolioFiles"),
      ...Array.from(formData.entries())
        .filter(([key]) => key.startsWith("portfolioFile_"))
        .map(([, value]) => value),
    ].filter((item): item is File => item instanceof File && item.size > 0);

    const [logoUpload, coverUpload, profileUpload] = await Promise.all([
      uploadFile(bucket, `${slug}/logo`, logoFile),
      uploadFile(bucket, `${slug}/cover`, coverFile),
      uploadFile(bucket, `${slug}/profile`, profileFile),
    ]);

    const portfolioUploads = await Promise.all(
      portfolioFiles.map((file) => uploadFile(bucket, `${slug}/portfolio`, file))
    );

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "florist",
        shop_name: shopName,
        slug,
      },
    });

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: authError?.message || "Kunde inte skapa användare." },
        { status: 400 }
      );
    }

    const floristPayload: JsonRecord = {
      id: authUser.user.id,
      email,
      first_name: firstName || null,
      last_name: lastName || null,
      shop_name: shopName,
      role: "florist",
      profile_name: slug,
      bio:
        getValue(payload, formData, ["bio", "description", "about", "presentation"]) ||
        "Florist på FloristSocial 🌸",
      is_active: true,
      slug,
      florist_name: shopName,
      phone: getValue(payload, formData, ["phone", "phoneNumber", "phone_number", "telephone"]),
      website: getValue(payload, formData, ["website", "webUrl", "web_url"]),
      instagram: getValue(payload, formData, ["instagram", "personalInstagram", "personal_instagram"]),
      business_instagram: getValue(payload, formData, [
        "businessInstagram",
        "business_instagram",
        "companyInstagram",
        "company_instagram",
      ]),
      address_line_1: getValue(payload, formData, [
        "addressLine1",
        "address_line_1",
        "address",
        "streetAddress",
        "street_address",
      ]),
      address_line_2: getValue(payload, formData, ["addressLine2", "address_line_2"]),
      postal_code: getValue(payload, formData, ["postalCode", "postal_code", "zip", "zipCode", "zip_code"]),
      city: getValue(payload, formData, ["city", "stad"]),
      area: getValue(payload, formData, ["area", "omrade", "område"]),
      municipality: getValue(payload, formData, ["municipality", "kommun"]),
      county: getValue(payload, formData, ["county", "lan", "län"]),
      description: getValue(payload, formData, ["description", "about", "bio", "presentation"]),
      delivery_model: getValue(payload, formData, ["deliveryModel", "delivery_model"]),
      delivery_areas: getJsonValue(payload, formData, ["deliveryAreas", "delivery_areas"], []),
      services: getJsonValue(payload, formData, ["services", "serviceTypes", "service_types"], []),
      opening_hours: getJsonValue(payload, formData, ["openingHours", "opening_hours"], null),
      closed_dates: getJsonValue(payload, formData, ["closedDates", "closed_dates"], []),
      stripe_account_id: getValue(payload, formData, ["stripeAccountId", "stripe_account_id"]),
      profile_image_url: profileUpload?.url || logoUpload?.url || "https://placehold.co/100x100",
      logo_url: logoUpload?.url || null,
      logo_path: logoUpload?.path || null,
      cover_image_url: coverUpload?.url || null,
      cover_image_path: coverUpload?.path || null,
      portfolio_images: portfolioUploads.filter(Boolean),
      updated_at: new Date().toISOString(),
    };

    const { data: florist, error: floristError } = await supabaseAdmin
      .from("florists")
      .insert(floristPayload)
      .select("*")
      .single();

    if (floristError) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);

      return NextResponse.json(
        {
          error: "Användaren skapades, men floristprofilen kunde inte sparas.",
          details: floristError.message,
          hint: "Kontrollera att kolumnerna i florists-tabellen finns i Supabase.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        florist,
        floristId: florist.id,
        profileUrl: `/florist/${florist.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Florist registration error:", error);

    return NextResponse.json(
      {
        error: "Registreringen misslyckades.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

