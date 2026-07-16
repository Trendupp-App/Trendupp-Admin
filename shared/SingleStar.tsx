export default function StarIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0 L13.8 9.2 L22 12 L13.8 14.8 L12 24 L10.2 14.8 L2 12 L10.2 9.2 Z" />
    </svg>
  );
}
