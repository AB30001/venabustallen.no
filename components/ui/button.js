import { cx } from "@/utils/all";
import Link from "next/link";

/**
 * Pill button — ghost (default), light-on-dark, or solid accent.
 * Matches 99designs reference: rounded-full, tracked uppercase, thin border.
 */
export default function Button({
  href,
  children,
  variant = "ghost",
  className,
  type = "button",
  ...rest
}) {
  const styles = {
    ghost: "btn-pill",
    light: "btn-pill-light",
    accent: "btn-pill-accent"
  };
  const cls = cx(styles[variant] || styles.ghost, className);

  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
