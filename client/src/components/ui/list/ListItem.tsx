"use client"
import { DOMAttributes, MouseEventHandler } from "react"
import Monogram, { color } from "../monogram/Monogram"
import style from "./ListItem.module.css"

type list_item_leading = "monogram" | "icon" | "image"
type list_item_trailing = "icon"

export type icon_color = "primary" | "secondary" | "tertiary" | "access" | "warning" | "error" | "none"

type ListItemProps = {
  nowrap?: boolean
  condition: number
  leading_type?: list_item_leading
  leading_color?: color
  leading?: string
  trailing_type?: list_item_trailing
  trailing_color?: color
  trailing?: string
  overline?: string
  headline: string
  url?: string
  isLoading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
}

export default function ListItem({
  nowrap = false,
  condition = 1,
  leading_type,
  leading_color,
  leading = "",
  trailing_type,
  trailing_color,
  trailing = "arrow_right",
  overline,
  url,
  headline = " ",
  isLoading = false,
  onClick,
  children,
}: ListItemProps) {
  if (onClick)
    return (
      <button
        className={
          style.list_item +
          " " +
          (condition == 1 ? style.condition1 : condition == 2 ? style.condition2 : style.condition3) +
          " " +
          (onClick != undefined ? "" : style.non_clickable)
        }
        onClick={onClick}>
        {leading_type ? (
          <div className={style.leading_element}>
            {leading_type == "monogram" ? (
              <Monogram monogram_type="monogram" letter={leading} isLoading={isLoading} color={leading_color} />
            ) : leading_type == "icon" ? (
              // <span className="material-symbols-rounded">{leading}</span>
              <Monogram monogram_type="icon" isLoading={isLoading} icon={leading} color={leading_color} />
            ) : leading_type == "image" ? (
              <Monogram monogram_type="image" isLoading={isLoading} url={url} />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        <div className={style.content}>
          <p className={style.overline + " " + (nowrap ? style.nowrap : "")}>{overline}</p>
          {isLoading ? <div className={style.load_div}></div> : <p className={style.headline + " " + (nowrap ? style.nowrap : "")}>{headline}</p>}
        </div>

        {trailing_type ? (
          <div className={style.leading_element}>
            {trailing_type == "icon" ? (
              <span
                className={
                  "material-symbols-rounded " +
                  (trailing_color
                    ? trailing_color == "primary"
                      ? style.primary
                      : trailing_color == "secondary"
                      ? style.secondary
                      : trailing_color == "tertiary"
                      ? style.tertiary
                      : trailing_color == "access"
                      ? style.access
                      : trailing_color == "warning"
                      ? style.warning
                      : trailing_color == "error"
                      ? style.error
                      : ""
                    : "")
                }>
                {trailing}
              </span>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {children}
      </button>
    )

  return (
    <div
      className={
        style.list_item +
        " " +
        (condition == 1 ? style.condition1 : condition == 2 ? style.condition2 : style.condition3) +
        " " +
        (onClick != undefined ? "" : style.non_clickable)
      }
      onClick={onClick}>
      {leading_type ? (
        <div className={style.leading_element}>
          {leading_type == "monogram" ? (
            <Monogram monogram_type="monogram" letter={leading} isLoading={isLoading} color={leading_color} />
          ) : leading_type == "icon" ? (
            // <span className="material-symbols-rounded">{leading}</span>
            <Monogram monogram_type="icon" isLoading={isLoading} icon={leading} color={leading_color} />
          ) : leading_type == "image" ? (
            <Monogram monogram_type="image" isLoading={isLoading} url={url} />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      <div className={style.content}>
        <p className={style.overline + " " + (nowrap ? style.nowrap : "")}>{overline}</p>
        {isLoading ? <div className={style.load_div}></div> : <p className={style.headline + " " + (nowrap ? style.nowrap : "")}>{headline}</p>}
      </div>

      {trailing_type ? (
        <div className={style.leading_element}>
          {trailing_type == "icon" ? (
            <span
              className={
                "material-symbols-rounded " +
                (trailing_color
                  ? trailing_color == "primary"
                    ? style.primary
                    : trailing_color == "secondary"
                    ? style.secondary
                    : trailing_color == "tertiary"
                    ? style.tertiary
                    : trailing_color == "access"
                    ? style.access
                    : trailing_color == "warning"
                    ? style.warning
                    : trailing_color == "error"
                    ? style.error
                    : ""
                  : "")
              }>
              {trailing}
            </span>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {children}
    </div>
  )
}
