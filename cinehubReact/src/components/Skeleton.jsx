export function Skeleton({ className = '', ...props }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-3xl bg-slate-800/70 ${className}`} {...props} />;
}
