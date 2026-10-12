export function Typography({ variant = 'body', as: Tag = 'p', className = '', children, ...props }) {
  const variants = {
    heading: 'text-4xl font-semibold text-white sm:text-5xl',
    subheading: 'text-2xl font-semibold text-white',
    body: 'text-base text-slate-300',
    label: 'text-sm font-semibold uppercase tracking-[0.24em] text-brand-200',
    caption: 'text-sm text-slate-400'
  };

  return (
    <Tag className={`${variants[variant] ?? variants.body} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
