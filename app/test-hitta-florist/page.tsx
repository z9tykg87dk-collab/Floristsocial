"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FloristResult = {
  florist_id: string;
  florist_name: string | null;
  shop_name: string | null;
  city: string | null;
  area: string | null;
  delivery_radius_km: number | null;
  latitude: number;
  longitude: number;
  distance_km: number;
};

export default function TestHittaFloristPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FloristResult[]>([]);
  const [error, setError] = useState("");

  async function searchFlorists() {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const geoRes = await fetch(
        `/api/geocode?address=${encodeURIComponent(address)}`
      );

      const geoData = await geoRes.json();

      if (!geoRes.ok) {
        throw new Error(geoData.error || "Kunde inte hitta adressen.");
      }

      const { data, error } = await supabase.rpc("find_nearby_florists", {
        recipient_lat: geoData.latitude,
        recipient_lng: geoData.longitude,
        max_distance_km: 30,
      });

      if (error) throw error;

      setResults(data || []);
    } catch (err: any) {
      setError(err.message || "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Hitta florist nära mottagaren</h1>

      <input
        className="mt-6 w-full rounded-xl border px-4 py-3"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Drottninggatan 10 Stockholm"
      />

      <button
        type="button"
        onClick={searchFlorists}
        
        className="mt-4 rounded-xl bg-black px-5 py-3 text-white cursor-pointer hover:opacity-90 hover:scale-105 transition-all duration-200"
      >
        {loading ? "Söker..." : "Hitta florist"}
      </button>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {results.map((florist) => (
          <div key={florist.florist_id} className="rounded-2xl border p-5">
            <h2 className="text-xl font-semibold">
              {florist.florist_name || florist.shop_name || "Florist"}
            </h2>

            <p className="text-gray-600">{florist.city || "Okänd stad"}</p>

            <p className="mt-2 text-sm text-gray-500">
              {florist.distance_km} km från mottagaren
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
