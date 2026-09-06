import { cx } from "@/utils/all";

export default function Label(props) {
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div className="inline-flex h-6 shrink-0 items-center justify-center rounded-full border border-line bg-mist/50 px-3 font-display text-[10px] font-semibold uppercase tracking-brand text-charcoal">
        {props.children}
      </div>
    );
  }

  return (
    <span
      className={cx(
        "inline-block font-display text-[10px] font-semibold uppercase tracking-brand text-accent",
        !margin && "mt-4"
      )}>
      {props.children}
    </span>
  );
}
