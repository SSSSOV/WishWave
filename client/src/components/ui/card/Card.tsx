"use client"

import { MouseEventHandler } from "react"
import List from "../list/List"
import ListItem from "../list/ListItem"
import Monogram from "../monogram/Monogram"
import Section from "../section/Section"
import style from "./Card.module.css"
import Button from "../buttons/Button"

type image_type = "icon" | "image" | "none"
type image_color = "primary" | "secondary" | "tertiary" | "access" | "warning" | "error" | "none"

interface ICard {
  imageType: image_type
  imageColor: image_color
  imageIcon: string
  imageUrl: string
  onCardClick?: MouseEventHandler<HTMLDivElement>
  onButtonClick?: MouseEventHandler<HTMLButtonElement>
  headline?: string
  overline?: string
}

export default function Card({ imageType, imageColor, imageIcon, imageUrl, headline, overline, onCardClick, onButtonClick }: ICard) {
  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation() // Останавливаем всплытие события
    onButtonClick?.(e)
  }

  if (onCardClick) {
    return (
      <div className={`${style.card} ${style.clickable}`} onClick={onCardClick}>
        {imageType !== "none" && (
          <Monogram url={imageUrl} icon={imageIcon} color={imageColor} monogram_type={imageType === "icon" ? "icon" : "image"} size="full" />
        )}
        <div className={style.card_content}>
          {headline && <p className={style.card_headline}>{headline}</p>}
          {overline && <p className={style.card_overline}>{overline}</p>}
          {onButtonClick && (
            <Section align_items="right" withoutPad>
              <Button
                icon="add"
                onClick={handleButtonClick} // Используем наш обработчик
              />
            </Section>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={style.card}>
      {imageType !== "none" && (
        <Monogram url={imageUrl} icon={imageIcon} color={imageColor} monogram_type={imageType === "icon" ? "icon" : "image"} size="full" />
      )}
      <div className={style.card_content}>
        {headline && <p className={style.card_headline}>{headline}</p>}
        {overline && <p className={style.card_overline}>{overline}</p>}
        {onButtonClick && (
          <Section align_items="right" withoutPad>
            <Button icon="add" onClick={onButtonClick} />
          </Section>
        )}
      </div>
    </div>
  )
}
