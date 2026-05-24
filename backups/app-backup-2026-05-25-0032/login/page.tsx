"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // hämta user + role
    const res = await fetch("/api/me");
    const data = await res.json();

    setLoading(false);

    // redirect baserat på role
    if (data?.florist?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }

    router.refresh();
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "420px" }}>
      <h1>Florist login</h1>

      <form
        onSubmit={handleLogin}
        style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "0.75rem" }}
          />
        </div>

        <div>
          <label htmlFor="password">Lösenord</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "0.75rem" }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "0.75rem" }}>
          {loading ? "Loggar in..." : "Logga in"}
        </button>

        {error ? <p style={{ color: "red" }}>{error}</p> : null}
      </form>
    </main>
  );
}
