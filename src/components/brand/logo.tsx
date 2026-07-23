
interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      <path
        d="M4 8L20 32L36 8"
        stroke="#106E3B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20L20 32L28 20"
        stroke="#106E3B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
}
