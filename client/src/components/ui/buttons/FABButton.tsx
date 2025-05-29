import { MouseEventHandler } from "react"
import style from "./FABButton.module.css"

export type FAB_size = "sm" | "md" | "lg"
export type FAB_color = "primary" | "secondary" | "tertiary"

export interface IFABButton {
  icon?: string
  label?: string
  button_size?: FAB_size
  button_color?: FAB_color
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function FABButton(props: IFABButton) {
  let button_classes: string[] = [style.FAB]

  if (props.button_size == "sm") button_classes.push(style.FAB_sm)
  else if (props.button_size == "lg") button_classes.push(style.FAB_lg)
  else button_classes.push(style.FAB_md)

  if (props.button_color == "secondary") button_classes.push(style.FAB_secondary)
  else if (props.button_color == "tertiary") button_classes.push(style.FAB_tertiary)
  else button_classes.push(style.FAB_primary)

  return (
    <button onClick={props.onClick} className={button_classes.join(" ")}>
      {props.icon ? (
        <span
          className={
            "material-symbols-rounded " +
            (props.button_size
              ? props.button_size == "lg"
                ? style.FAB_icon_lg
                : props.button_size == "sm"
                ? style.FAB_icon_sm
                : style.FAB_icon_md
              : style.FAB_icon_md)
          }>
          {props.icon}
        </span>
      ) : null}
      {props.label ? (
        <span
          className={
            props.button_size
              ? props.button_size == "lg"
                ? style.FAB_label_lg
                : props.button_size == "sm"
                ? style.FAB_label_sm
                : style.FAB_label_md
              : style.FAB_label_md
          }>
          {props.label}
        </span>
      ) : null}
    </button>
  )
}
