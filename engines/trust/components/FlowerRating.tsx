"use client";

type FlowerRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: 22,
  md: 32,
  lg: 42,
};

export default function FlowerRating({
  value,
  onChange,
  size = "md",
}: FlowerRatingProps) {
  const iconSize = sizes[size];

  return (
    <div className="flex items-center gap-3">
      {[1, 2, 3, 4, 5].map((score) => {
        const active = score <= value;

        return (
          <button
            key={score}
            type="button"
            onClick={() => onChange?.(score)}
            className="group grid place-items-center"
            aria-label={`${score} av 5`}
          >
            <span
              style={{ fontSize: iconSize }}
              className={active ? "text-pink-600" : "text-pink-200"}
            >
              ♡
            </span>
          </button>
        );
      })}
    </div>
  );
}
