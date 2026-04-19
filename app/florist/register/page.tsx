"use client";

import { useState } from "react";

export default function Page() {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Lösenorden matchar inte");
      return;
    }

    setMessage("Skickar...");

    try {
      const res = await fetch("/api/florists/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Något gick fel");
        return;
      }

      setMessage(data.message || "Klart");
    } catch {
      setMessage("Kunde inte kontakta servern");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Registrera florist</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 400 }}>
        <input
          placeholder="Förnamn"
          value={form.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
        />

        <input
          placeholder="Efternamn"
          value={form.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
        />

        <input
          type="email"
          placeholder="E-post"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />

        <input
          type="password"
          placeholder="Lösenord"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
        />

        <input
          type="password"
          placeholder="Bekräfta lösenord"
          value={form.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
        />

        <button type="submit">Registrera</button>
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
