// Page title in the Home style: small purple mono label, then a light headline (wrap the key word in <b>).
const PageHeader = ({ eyebrow, children, className = '' }) => (
  <header className={className}>
    {eyebrow && (
      <p className="mb-2 font-mono text-[13px] tracking-[.12em] uppercase text-brand">
        {eyebrow}
      </p>
    )}
    <h1 className="text-3xl sm:text-4xl font-light tracking-[-0.03em] text-ink [&_b]:font-bold">
      {children}
    </h1>
  </header>
);

export default PageHeader;
