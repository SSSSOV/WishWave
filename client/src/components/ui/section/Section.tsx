import styles from "./Section.module.css";

type align_items = "left" | "center" | "right";
type size = "sm" | "md" | "lg";
type direction = "col" | "row";

export default function Section({
  title,
  title_size = "sm",
  padding_top_size,
  padding_bot_size,
  align_items,
  items_direction = "col",
  children,
}: {
  title?: string;
  title_size?: size;
  padding_top_size?: size;
  padding_bot_size?: size;
  align_items?: align_items;
  items_direction?: direction;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={
        styles.section +
        " " +
        (align_items == "left"
          ? styles.left
          : align_items == "center"
          ? styles.center
          : align_items == "right"
          ? styles.right
          : "") +
        " " +
        (items_direction == "row" ? styles.row : "") +
        " " +
        (padding_top_size == "sm"
          ? styles.pt_sm
          : padding_top_size == "md"
          ? styles.pt_md
          : padding_top_size == "lg"
          ? styles.pt_lg
          : "") +
        " " +
        (padding_bot_size == "sm"
          ? styles.pb_sm
          : padding_bot_size == "md"
          ? styles.pb_md
          : padding_bot_size == "lg"
          ? styles.pb_lg
          : "")
      }>
      {title ? (
        <span
          className={
            title_size == "sm"
              ? styles.title_sm
              : title_size == "md"
              ? styles.title_md
              : title_size == "lg"
              ? styles.title_lg
              : ""
          }>
          {title}
        </span>
      ) : (
        ""
      )}
      {children}
    </div>
  );
}
