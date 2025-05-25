"use client";
import { DOMAttributes, MouseEventHandler } from "react";
import Monogram from "../monogram/Monogram";
import style from "./ListItem.module.css";

type list_item_leading = "monogram" | "icon" | "image";
type list_item_trailing = "icon";

export type list_item_icon_color = "primary" | "secondary" | "tertiary";

type ListItemProps = {
  nowrap?: boolean;
  condition: number;
  leading_type?: list_item_leading;
  leading?: string;
  trailing_type?: list_item_trailing;
  trailing?: string;
  overline?: string;
  headline: string;
  url?: string;
  isLoading?: boolean;
  color?: list_item_icon_color;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function ListItem({
  nowrap = false,
  condition = 1,
  leading_type,
  leading = "",
  trailing_type,
  trailing = "arrow_right",
  overline,
  url,
  headline = " ",
  isLoading = false,
  color = "primary",
  onClick,
}: ListItemProps) {
  return (
    <div
      className={
        style.list_item +
        " " +
        (condition == 1 ? style.condition1 : condition == 2 ? style.condition2 : style.condition3) +
        " " +
        (onClick ? style.clickable : "")
      }
      onClick={onClick ? onClick : () => {}}>
      {leading_type ? (
        <div className={style.leading_element}>
          {leading_type == "monogram" ? (
            <Monogram monogram_type="monogram" letter={leading} isLoading={isLoading} color={color} />
          ) : leading_type == "icon" ? (
            // <span className="material-symbols-rounded">{leading}</span>
            <Monogram monogram_type="icon" isLoading={isLoading} icon={leading} color={color} />
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
        <div className={style.leading_element}>{trailing_type == "icon" ? <span className={"material-symbols-rounded"}>{trailing}</span> : ""}</div>
      ) : (
        ""
      )}
    </div>
  );
}
