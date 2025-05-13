import styles from "./ContentConteiner.module.css";
type top_app_bar_size = "sm" | "md" | "lg" | "none";
type navigation_type = "bar" | "rail" | "none";

export default function ContentContainer({
  topBarSize = "sm",
  isScreen = false,
  navigationType = "none",
  children,
}: {
  topBarSize?: top_app_bar_size;
  isScreen?: boolean;
  navigationType?: navigation_type;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={
        (topBarSize == "sm"
          ? styles.top_sm
          : topBarSize == "md"
          ? styles.top_md
          : topBarSize == "lg"
          ? styles.top_lg
          : styles.top_none) +
        " " +
        (isScreen ? styles.screen : "") +
        " " +
        (navigationType == "bar" ? styles.nav_bar : navigationType == "rail" ? styles.nav_rail : "")
      }>
      {children}
    </div>
  );
}
