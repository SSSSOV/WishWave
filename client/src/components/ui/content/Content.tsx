import style from "./Content.module.css"
type top_app_bar_size = "sm" | "md" | "lg" | "none"
type navigation_type = "bar" | "rail" | "none"

export type bg_color = "primary" | "secondary" | "tertiary" | "none"

export default function Content({
  topBarSize = "sm",
  isScreen = false,
  navigationType = "none",
  withPad = false,
  bgColor = "none",
  children,
}: {
  topBarSize?: top_app_bar_size
  isScreen?: boolean
  navigationType?: navigation_type
  withPad?: boolean
  bgColor?: bg_color
  children?: React.ReactNode
}) {
  return (
    <div
      className={
        style.h +
        " " +
        (withPad ? style.withPad : "") +
        " " +
        (topBarSize == "sm" ? style.top_sm : topBarSize == "md" ? style.top_md : topBarSize == "lg" ? style.top_lg : style.top_none) +
        " " +
        (isScreen ? style.screen : "") +
        " " +
        (navigationType == "bar" ? style.nav_bar : navigationType == "rail" ? style.nav_rail : "") +
        " " +
        (bgColor == "primary" ? style.primary : bgColor == "secondary" ? style.secondary : bgColor == "tertiary" ? style.tertiary : "")
      }>
      {children}
    </div>
  )
}
