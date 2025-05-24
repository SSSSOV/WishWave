"use client";
import { DOMAttributes, MouseEventHandler } from "react";
import Monogram from "../monogram/Monogram";
import style from "./ListItem.module.css";

type list_item_leading = "monogram" | "icon" | "image";
type list_item_trailing = "icon";

type ListItemProps = {
  condition: number;
  leading_type?: list_item_leading;
  leading?: string;
  trailing_type?: list_item_trailing;
  trailing?: string;
  overline?: string;
  headline: string;
  url?: string;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function ListItem({
  condition = 1,
  leading_type,
  leading = "",
  trailing_type,
  trailing = "arrow_right",
  overline,
  url,
  headline = " ",
  isLoading = false,
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
            <Monogram monogram_type="monogram" letter={leading} isLoading={isLoading} />
          ) : leading_type == "icon" ? (
            // <span className="material-symbols-rounded">{leading}</span>
            <Monogram monogram_type="icon" isLoading={isLoading} icon={leading} />
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
        <p className={style.overline}>{overline}</p>
        {isLoading ? <div className={style.load_div}></div> : <span className={style.headline}>{headline}</span>}
      </div>

      {trailing_type ? (
        <div className={style.leading_element}>{trailing_type == "icon" ? <span className={"material-symbols-rounded"}>{trailing}</span> : ""}</div>
      ) : (
        ""
      )}
    </div>
  );
}
