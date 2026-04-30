import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ShopPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: currentUser } = await supabase
    .from("florists")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (currentUser?.role !== "customer") {
    redirect("/dashboard");
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, title, description, price_amount, image_url, category")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Customer shop</h1>
      <p>Du är inloggad som kund.</p>
      <p>Email: {currentUser.email}</p>

      <a href="/logout">Logga ut</a>

      <section style={{ marginTop: "2rem" }}>
        <h2>Produkter</h2>

        {!products || products.length === 0 ? (
          <p>Inga produkter ännu.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            {products.map((product) => (
              <article
                key={product.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "1rem",
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      borderRadius: "12px",
                      marginBottom: "1rem",
                    }}
                  />
                ) : null}

                <p style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>
                  {product.category}
                </p>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <strong>{product.price_amount} SEK</strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
