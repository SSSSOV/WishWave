import styles from "./Section.module.css"

type align_items = "left" | "center" | "right"
type size = "sm" | "md" | "lg" | "xs"
type direction = "col" | "row"

export default function Section({
  title,
  title_size = "sm",
  padding_top_size,
  padding_bot_size,
  align_items,
  items_direction = "col",
  withoutPad = false,
  isFit = false,
  children,
}: {
  title?: string
  title_size?: size
  padding_top_size?: size
  padding_bot_size?: size
  align_items?: align_items
  items_direction?: direction
  withoutPad?: boolean
  isFit?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      className={
        styles.section +
        " " +
        (isFit ? " " : styles.full) +
        " " +
        (align_items == "left" ? styles.left : align_items == "center" ? styles.center : align_items == "right" ? styles.right : "") +
        " " +
        (items_direction == "row" ? styles.row : "") +
        " " +
        (padding_top_size == "sm" ? styles.pt_sm : padding_top_size == "md" ? styles.pt_md : padding_top_size == "lg" ? styles.pt_lg : styles.pt_xs) +
        " " +
        (padding_bot_size == "sm" ? styles.pb_sm : padding_bot_size == "md" ? styles.pb_md : padding_bot_size == "lg" ? styles.pb_lg : styles.pb_xs) +
        " " +
        (withoutPad ? styles.without_pad : "")
      }>
      {title ? (
        <span
          className={
            title_size == "sm" ? styles.title_sm : title_size == "md" ? styles.title_md : title_size == "lg" ? styles.title_lg : styles.title_xs
          }>
          {title}
        </span>
      ) : (
        ""
      )}
      {children}
    </div>
  )
}
