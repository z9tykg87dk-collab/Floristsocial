type Props = {
  size?: number;
  className?: string;
};

export default function FloristFlower({ size = 34, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 56V28"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M32 28C24 18 15 17 10 18C11 33 18 43 32 45"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 28C40 18 49 17 54 18C53 33 46 43 32 45"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 28L42 14L52 28"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 28L22 14L12 28"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
