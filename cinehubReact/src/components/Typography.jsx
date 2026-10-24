export function Typography({ variant = 'body', as: Tag = 'p', className = '', children, ...props }) {
  const variants = {
    heading: 'text-4xl font-semibold tracking-tight text-white sm:text-5xl',
    subheading: 'text-2xl font-semibold tracking-tight text-white',
    body: 'text-base text-slate-300',
    label: 'text-xs font-semibold uppercase tracking-[0.24em] text-brand-300',
    caption: 'text-sm text-slate-400'
  };

  return (
    <Tag className={`${variants[variant] ?? variants.body} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
