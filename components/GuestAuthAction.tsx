"use client";

import { useState } from "react";
import Link from "next/link";

export default function GuestAuthAction({
  icon,
  children,
  primary = false,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          height: 58,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderRadius: 14,
          padding: "0 28px",
          fontSize: 14,
          fontWeight: 850,
          whiteSpace: "nowrap",
          color: primary ? "white" : "#e60073",
          background: primary ? "#e60073" : "white",
          border: primary ? "1px solid #e60073" : "1px solid #ff8abd",
          boxShadow: primary ? "0 10px 20px rgba(230,0,115,0.14)" : "none",
          cursor: "pointer",
        }}
      >
        {icon}
        {children}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            background: "rgba(0,0,0,0.45)",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 430,
              borderRadius: 28,
              background: "white",
              padding: 28,
              boxShadow: "0 24px 70px rgba(0,0,0,0.22)",
              border: "1px solid #ffe0ed",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 25, fontWeight: 950 }}>
              Registrera dig eller logga in
            </h2>

            <p style={{ margin: "10px 0 0", color: "#57534e", lineHeight: 1.6 }}>
              För att chatta, ringa eller använda video behöver du vara inloggad på FloristSocial.
            </p>

            <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
              <Link
                href="/private/customer-register"
                style={{
                  height: 50,
                  borderRadius: 16,
                  background: "#e60073",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  textDecoration: "none",
                  fontWeight: 900,
                }}
              >
                Registrera dig
              </Link>

              <Link
                href="/auth/sign-in"
                style={{
                  height: 50,
                  borderRadius: 16,
                  background: "white",
                  color: "#1c1917",
                  display: "grid",
                  placeItems: "center",
                  textDecoration: "none",
                  fontWeight: 900,
                  border: "1px solid #e7e2dc",
                }}
              >
                Logga in
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  height: 42,
                  border: 0,
                  background: "transparent",
                  color: "#78716c",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
