import type { ReactNode } from "react";

type FSCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "soft" | "glass" | "section";
};

const variants = {
  default: "rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-stone-200/70",
  soft: "rounded-[28px] bg-pink-50/60 p-6 ring-1 ring-pink-100",
  glass: "rounded-[28px] bg-white/85 p-6 shadow-xl ring-1 ring-white/60 backdrop-blur-xl",
  section: "rounded-[36px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70 md:p-6",
};

export default function FSCard({ children, className = "", variant = "default" }: FSCardProps) {
  return <section className={`${variants[variant]} ${className}`}>{children}</section>;
}
