import style from "./Content.module.css";
type top_app_bar_size = "sm" | "md" | "lg" | "none";
type navigation_type = "bar" | "rail" | "none";

export default function Content({
  topBarSize = "sm",
  isScreen = false,
  navigationType = "none",
  withoutPad = false,
  children,
}: {
  topBarSize?: top_app_bar_size;
  isScreen?: boolean;
  navigationType?: navigation_type;
  withoutPad?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={
        (withoutPad ? "" : style.content) +
        " " +
        (topBarSize == "sm"
          ? style.top_sm
          : topBarSize == "md"
          ? style.top_md
          : topBarSize == "lg"
          ? style.top_lg
          : style.top_none) +
        " " +
        (isScreen ? style.screen : "") +
        " " +
        (navigationType == "bar" ? style.nav_bar : navigationType == "rail" ? style.nav_rail : "")
      }>
      {children}
    </div>
  );
}
