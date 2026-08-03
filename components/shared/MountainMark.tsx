/** The site mark — a two-peak range with a sun behind the saddle. */
export default function MountainMark({
  className = "",
  size = 30,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="24.5" cy="14" r="4.6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M2 32.5h36"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 32.5 14.5 13l6.2 11.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M17.6 26.2 23.4 19l12 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* snow cap on the main peak */}
      <path
        d="M10.6 19.8h7.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
