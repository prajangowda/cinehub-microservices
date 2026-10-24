import { Clapperboard } from "lucide-react";

export function BrandMark({ iconClassName = "h-6 w-6", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xl font-semibold tracking-wide text-white ${className}`}>
      <Clapperboard aria-hidden="true" className={`shrink-0 text-[#f12b3b] ${iconClassName}`} />
      <span>CINEHUB</span>
    </span>
  );
}
