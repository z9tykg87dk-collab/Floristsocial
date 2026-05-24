import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JsonRecord = Record<string, any>;

type UploadedImageInfo = {
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

function asNumber(value: unknown, fallback = 0) {
  const text = asString(value).replace(/[^0-9.,]/g, "").replace(",", ".");
  if (!text) return fallback;
  const number = Number(text);
  return Number.isFinite(number) ? number : fallback;
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  const text = asString(value).toLowerCase();
  return text === "true" || text === "1" || text === "yes" || text === "ja";
}

function asArray(value: any) {
  return Array.isArray(value) ? value : [];
}

function parsePayload(formData: FormData): JsonRecord {
  const rawPayload = formData.get("payload");

  if (!rawPayload || typeof rawPayload !== "string") return {};

  try {
    const parsed = JSON.parse(rawPayload);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    return {};
  } catch (error) {
    console.error("Could not parse post payload:", error);
    return {};
  }
}

function normalizeHashtags(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => asString(item))
      .filter(Boolean)
      .map((item) => item.startsWith("#") ? item : `#${item}`);
  }

  return asString(value)
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.startsWith("#") ? item : `#${item}`);
}

function getPayloadString(payload: JsonRecord, names: string[], fallback = "") {
  for (const name of names) {
    const value = asString(payload[name]);
    if (value) return value;
  }

  return fallback;
}

async function uploadImage(bucket: string, folder: string, file: File | null): Promise<UploadedImageInfo | null> {
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

async function findFlorist(floristId: string) {
  if (!floristId) return null;

  const { data, error } = await supabaseAdmin
    .from("florists")
    .select("id, shop_name, florist_name, slug, city, country, logo_url, email, phone")
    .eq("id", floristId)
    .maybeSingle();

  if (error) throw new Error(`Could not fetch florist: ${error.message}`);
  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const floristId = searchParams.get("floristId") || "";
    const category = searchParams.get("category") || "";
    const style = searchParams.get("style") || "";
    const shoppableOnly = searchParams.get("shoppable") === "true";
    const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
    const offset = Math.max(Number(searchParams.get("offset") || 0), 0);

    let query = supabaseAdmin
      .from("feed_items")
      .select("*")
      .range(offset, offset + limit - 1);

    if (floristId) query = query.eq("florist_id", floristId);
    if (category) query = query.eq("category", category);
    if (style) query = query.eq("style", style);
    if (shoppableOnly) query = query.eq("is_shoppable", true);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Kunde inte hämta feed.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: data || [], limit, offset });
  } catch (error) {
    console.error("Posts GET error:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta posts.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const payload = parsePayload(formData);

    const floristId = getPayloadString(payload, ["floristId", "florist_id"]);
    const florist = await findFlorist(floristId);

    if (!florist) {
      return NextResponse.json(
        { error: "Florist saknas eller hittades inte." },
        { status: 400 }
      );
    }

    const imageFile = formData.get("image") instanceof File ? (formData.get("image") as File) : null;
    const videoFile = formData.get("video") instanceof File ? (formData.get("video") as File) : null;

    if (!imageFile && !videoFile) {
      return NextResponse.json(
        { error: "Ladda upp minst en bild eller video." },
        { status: 400 }
      );
    }

    const bucket = "florist-portfolio";
    const baseFolder = `${florist.slug || florist.id}/posts`;

    const imageUpload = await uploadImage(bucket, `${baseFolder}/images`, imageFile);
    const videoUpload = await uploadImage(bucket, `${baseFolder}/videos`, videoFile);

    const isShoppable = asBoolean(payload.isShoppable ?? payload.is_shoppable);
    const basePrice = asNumber(payload.basePrice ?? payload.price, 0);
    const minPrice = Math.max(asNumber(payload.minPrice, 400), 400);
    const title = getPayloadString(payload, ["title", "productTitle"], "Köp liknande arrangemang");
    const caption = getPayloadString(payload, ["caption"]);
    const description = getPayloadString(payload, ["description"]);
    const category = getPayloadString(payload, ["category"]);
    const style = getPayloadString(payload, ["style"]);
    const occasion = getPayloadString(payload, ["occasion"]);
    const serviceName = getPayloadString(payload, ["serviceName", "service_name"]);
    const hashtags = normalizeHashtags(payload.hashtags || caption);
    const mediaType = videoUpload ? "video" : "image";

    if (isShoppable && basePrice < 400) {
      return NextResponse.json(
        { error: "Köpbara produkter måste ha minst 400 kr i produktpris." },
        { status: 400 }
      );
    }

    const postPayload: JsonRecord = {
      florist_id: florist.id,
      author_user_id: payload.authorUserId || null,
      caption,
      description,
      hashtags,
      media_type: mediaType,
      image_original_url: imageUpload?.url || null,
      image_medium_url: imageUpload?.url || null,
      image_thumbnail_url: imageUpload?.url || null,
      video_url: videoUpload?.url || null,
      image_alt: getPayloadString(payload, ["imageAlt", "image_alt"], title || caption || "FloristSocial bild"),
      is_public: payload.isPublic === undefined ? true : asBoolean(payload.isPublic),
      is_featured: asBoolean(payload.isFeatured),
      is_sponsored: asBoolean(payload.isSponsored),
      is_shoppable: isShoppable,
      city: getPayloadString(payload, ["city"], florist.city || ""),
      country: getPayloadString(payload, ["country"], florist.country || "Sverige"),
      category,
      style,
      occasion,
      color_palette: asArray(payload.colorPalette || payload.color_palette),
    };

    const { data: post, error: postError } = await supabaseAdmin
      .from("posts")
      .insert(postPayload)
      .select("*")
      .single();

    if (postError) {
      return NextResponse.json(
        { error: "Posten kunde inte sparas.", details: postError.message, attemptedPayload: postPayload },
        { status: 500 }
      );
    }

    let product = null;

    if (isShoppable) {
      const productPayload: JsonRecord = {
        post_id: post.id,
        florist_id: florist.id,
        title,
        description: description || caption,
        category,
        service_name: serviceName || category,
        style,
        occasion,
        base_price: basePrice,
        min_price: minPrice,
        price_amount: basePrice,
        price_currency: getPayloadString(payload, ["currency"], "SEK"),
        currency: getPayloadString(payload, ["currency"], "SEK"),
        vat_rate: asNumber(payload.vatRate, 25),
        image_original_url: imageUpload?.url || null,
        image_medium_url: imageUpload?.url || null,
        image_thumbnail_url: imageUpload?.url || null,
        image_alt: getPayloadString(payload, ["imageAlt", "image_alt"], title),
        is_active: true,
        is_public: true,
        is_featured: asBoolean(payload.isFeatured),
        is_sponsored: asBoolean(payload.isSponsored),
        allow_price_upgrade: payload.allowPriceUpgrade === undefined ? true : asBoolean(payload.allowPriceUpgrade),
        allow_custom_message: true,
        allow_inspiration_upload: false,
        seasonal_disclaimer:
          getPayloadString(payload, ["seasonalDisclaimer", "seasonal_disclaimer"]) ||
          "Vi försöker producera en liknande bukett eller arrangemang som på bilden. Utseendet kan variera något beroende på säsong, blommornas tillgänglighet och floristens aktuella sortiment.",
        delivery_available: payload.deliveryAvailable === undefined ? true : asBoolean(payload.deliveryAvailable),
        pickup_available: payload.pickupAvailable === undefined ? true : asBoolean(payload.pickupAvailable),
      };

      const { data: productData, error: productError } = await supabaseAdmin
        .from("products")
        .insert(productPayload)
        .select("*")
        .single();

      if (productError) {
        await supabaseAdmin.from("posts").delete().eq("id", post.id);
        return NextResponse.json(
          { error: "Produkten kunde inte sparas.", details: productError.message, attemptedPayload: productPayload },
          { status: 500 }
        );
      }

      product = productData;

      const variants = [
        { label: "Standard", description: "Som bilden eller liknande uttryck.", price: basePrice, sort_order: 1, is_default: true },
        { label: "Pampigare", description: "Större och fylligare arrangemang.", price: Math.round(basePrice * 1.35), sort_order: 2, is_default: false },
        { label: "Extra pampig", description: "Premiumvariant med mer volym och exklusivare känsla.", price: Math.round(basePrice * 1.7), sort_order: 3, is_default: false },
      ].filter((variant) => variant.price >= 400);

      await supabaseAdmin.from("product_variants").insert(
        variants.map((variant) => ({
          product_id: product.id,
          label: variant.label,
          description: variant.description,
          price: variant.price,
          currency: product.currency || "SEK",
          sort_order: variant.sort_order,
          is_default: variant.is_default,
          is_active: true,
        }))
      );
    }

    return NextResponse.json(
      {
        success: true,
        post,
        product,
        message: isShoppable ? "Post och köpbar produkt skapades." : "Post skapades.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Posts POST error:", error);
    return NextResponse.json(
      { error: "Posten kunde inte skapas.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

