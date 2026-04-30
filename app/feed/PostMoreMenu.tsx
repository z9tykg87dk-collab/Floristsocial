"use client";

import { useEffect, useRef, useState } from "react";

export default function PostMoreMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label="Fler alternativ"
        aria-expanded={open}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "22px",
          lineHeight: 1,
          padding: "4px 8px",
        }}
      >
        ⋯
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.18)",
              zIndex: 20,
            }}
          />

          <div
            style={{
              position: "absolute",
              right: 0,
              top: "32px",
              width: "280px",
              maxWidth: "calc(100vw - 32px)",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "14px",
              padding: "8px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              zIndex: 30,
              animation: "postMoreMenuIn 140ms ease-out",
            }}
          >
            <button style={menuButton}>Om denna florist</button>
            <button style={menuButton}>Därför ser du denna annons</button>
            <button style={menuButton}>
              Allmän info om FloristSocial annonser
            </button>
            <button style={menuButton}>Intresserad</button>
            <button style={menuButton}>Inte intresserad</button>
            <button style={{ ...menuButton, color: "crimson" }}>
              Anmäl annons
            </button>
          </div>

          <style>{`
            @keyframes postMoreMenuIn {
              from {
                opacity: 0;
                transform: translateY(-6px) scale(0.98);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @media (max-width: 600px) {
              div[style*="postMoreMenuIn"] {
                position: fixed !important;
                left: 12px !important;
                right: 12px !important;
                bottom: 12px !important;
                top: auto !important;
                width: auto !important;
                max-width: none !important;
                border-radius: 18px !important;
                animation: postMoreMenuMobileIn 160ms ease-out !important;
              }

              @keyframes postMoreMenuMobileIn {
                from {
                  opacity: 0;
                  transform: translateY(18px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

const menuButton: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px",
  textAlign: "left",
  border: "none",
  background: "white",
  cursor: "pointer",
  borderRadius: "10px",
  fontSize: "14px",
};
