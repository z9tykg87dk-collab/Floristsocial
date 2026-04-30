"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const supabase = createSupabaseBrowserClient();

      await supabase.auth.signOut();

      router.push("/login");
      router.refresh();
    };

    logout();
  }, [router]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Loggar ut...</h1>
    </main>
  );
}
