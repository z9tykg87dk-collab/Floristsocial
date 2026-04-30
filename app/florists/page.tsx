import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function FloristsPage() {
  const { data: florists } = await supabase
    .from("florists")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Florister</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {florists?.map((f: any) => {
          const name =
            f.shop_name ||
            `${f.first_name || ""} ${f.last_name || ""}`.trim() ||
            f.email

          return (
            <Link
              key={f.id}
              href={`/florist/${f.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 16,
                  padding: 16,
                  background: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 12,
                    background: "#f3f3f3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                    overflow: "hidden",
                  }}
                >
                  {f.profile_image_url ? (
                    <img
                      src={f.profile_image_url}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 40 }}>🌸</span>
                  )}
                </div>

                <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>{name}</h2>

                <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
                  {f.bio || "Florist på FloristSocial"}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
