import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Brødsmuler" className="mb-8">
      <ol className="flex flex-wrap items-center justify-center gap-1 font-display text-[10px] font-semibold uppercase tracking-brand text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <span aria-hidden="true" className="mx-1 text-line">
                  /
                </span>
              )}
              {!isLast && item.path ? (
                <Link href={item.path} className="hover:text-accent">
                  {item.name}
                </Link>
              ) : (
                <span className="text-charcoal" aria-current="page">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
