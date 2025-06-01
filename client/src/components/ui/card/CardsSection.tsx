"use client"

import style from "./CardsSection.module.css"

export default function CardsSection({ children }: { children?: React.ReactNode }) {
  return <div className={style.cards_section}>{children}</div>
}
