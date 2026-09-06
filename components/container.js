import { cx } from "@/utils/all";

export default function Container(props) {
  return (
    <div
      className={cx(
        "container mx-auto px-6 md:px-8 xl:px-5",
        props.large ? "max-w-screen-xl" : "max-w-screen-lg",
        !props.alt && "py-8 lg:py-12",
        props.className
      )}>
      {props.children}
    </div>
  );
}
