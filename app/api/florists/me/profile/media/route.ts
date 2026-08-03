import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "florist-portfolio";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

type MediaField =
  | "profileImage"
  | "logo"
  | "coverImage";

type UploadedFileInfo = {
  path: string;
  url: string;
};

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Miljövariabeln ${name} saknas.`);
  }

  return value;
}

function fileExtension(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

function validateImage(
  value: FormDataEntryValue | null,
  label: string,
): File | null {
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  if (!ALLOWED_IMAGE_TYPES.has(value.type)) {
    throw new Error(
      `${label} måste vara JPG, PNG, WebP, GIF eller AVIF.`,
    );
  }

  if (value.size > MAX_FILE_SIZE) {
    throw new Error(`${label} får vara högst 10 MB.`);
  }

  return value;
}

async function uploadImage(
  supabaseAdmin: any,
  userId: string,
  folder: string,
  file: File,
): Promise<UploadedFileInfo> {
  const extension = fileExtension(file);
  const path =
    `${userId}/${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(
      `Bilden kunde inte laddas upp: ${uploadError.message}`,
    );
  }

  const { data } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return {
    path,
    url: data.publicUrl,
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Du måste vara inloggad." },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    let profileImage: File | null;
    let logo: File | null;
    let coverImage: File | null;

    try {
      profileImage = validateImage(
        formData.get("profileImage"),
        "Profilbilden",
      );
      logo = validateImage(
        formData.get("logo"),
        "Logotypen",
      );
      coverImage = validateImage(
        formData.get("coverImage"),
        "Omslagsbilden",
      );
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "En bild är ogiltig.",
        },
        { status: 400 },
      );
    }

    const files: Array<{
      field: MediaField;
      folder: string;
      file: File | null;
    }> = [
      {
        field: "profileImage",
        folder: "profile",
        file: profileImage,
      },
      {
        field: "logo",
        folder: "logo",
        file: logo,
      },
      {
        field: "coverImage",
        folder: "cover",
        file: coverImage,
      },
    ];

    const selectedFiles = files.filter(
      (
        item,
      ): item is {
        field: MediaField;
        folder: string;
        file: File;
      } => item.file !== null,
    );

    if (selectedFiles.length === 0) {
      return NextResponse.json(
        { error: "Välj minst en bild att ladda upp." },
        { status: 400 },
      );
    }

    const supabaseAdmin = createClient(
      requiredEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
      requiredEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const uploaded: Partial<
      Record<MediaField, UploadedFileInfo>
    > = {};

    for (const item of selectedFiles) {
      uploaded[item.field] = await uploadImage(
        supabaseAdmin,
        user.id,
        item.folder,
        item.file,
      );
    }

    const updatePayload: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };

    if (uploaded.profileImage) {
      updatePayload.profile_image_url =
        uploaded.profileImage.url;
      updatePayload.profile_image_path =
        uploaded.profileImage.path;
    }

    if (uploaded.logo) {
      updatePayload.logo_url = uploaded.logo.url;
      updatePayload.logo_path = uploaded.logo.path;
    }

    if (uploaded.coverImage) {
      updatePayload.cover_image_url =
        uploaded.coverImage.url;
      updatePayload.cover_image_path =
        uploaded.coverImage.path;
    }

    /*
     * Service role används för Storage-uppladdningen, men uppdateringen
     * begränsas uttryckligen till den autentiserade användarens id.
     * Inga juridiska, administrativa, Stripe- eller verifieringsfält
     * accepteras av denna route.
     */
    const { data, error: updateError } = await supabaseAdmin
      .from("florists")
      .update(updatePayload)
      .eq("id", user.id)
      .select(
        [
          "id",
          "profile_image_url",
          "logo_url",
          "cover_image_url",
        ].join(","),
      )
      .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        {
          error: "Bildreferenserna kunde inte sparas.",
          details: updateError.message,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Floristprofilen saknas eller tillhör inte kontot.",
        },
        { status: 404 },
      );
    }

    const mediaRow = data as unknown as {
      id: string;
      profile_image_url: string | null;
      logo_url: string | null;
      cover_image_url: string | null;
    };

    return NextResponse.json({
      success: true,
      media: {
        profileImageUrl: mediaRow.profile_image_url || "",
        logoUrl: mediaRow.logo_url || "",
        coverImageUrl: mediaRow.cover_image_url || "",
      },
    });
  } catch (error) {
    console.error(
      "POST /api/florists/me/profile/media failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Bilderna kunde inte laddas upp.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 },
    );
  }
}
