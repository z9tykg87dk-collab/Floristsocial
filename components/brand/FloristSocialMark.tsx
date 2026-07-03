type Props = {
  size?: number;
  className?: string;
};

export default function FloristSocialMark({ size = 78, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 6C26 6 10 23 10 47C10 72 31 91 44 110"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M50 6C74 6 90 23 90 47C90 72 69 91 56 110"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M50 88V42"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M50 42C39 28 27 27 20 29C21 49 31 63 50 66"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M50 42C61 28 73 27 80 29C79 49 69 63 50 66"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M50 42L62 24L75 42"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M50 42L38 24L25 42"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
