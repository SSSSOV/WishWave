"use client"
import { useEffect, useRef } from "react"
import { useUnit } from "effector-react"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import styles from "@/app/home.module.css"
import { $pageTitle, handleSetPageTitle } from "@/context/page"
import Button from "@/components/ui/buttons/Button"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function MainPage() {
  usePageTitle("Главная")

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      // Предотвращаем вертикальный скролл страницы
      // e.preventDefault();
      // Скроллим контейнер по горизонтали
      scrollContainerRef.current.scrollLeft += e.deltaY
    }
  }

  return (
    <>
      <Section title="Недавние обновления друзей" title_size="md">
        <div className={styles.row}>
          <div ref={scrollContainerRef} className={styles.scrollContainer} onWheel={handleWheel}>
            <Monogram letter="РК" size="md" color="primary" />
            <Monogram letter="РК" size="md" color="secondary" />
            <Monogram letter="РК" size="md" color="tertiary" />
            <Monogram letter="РК" size="md" color="primary" />
            <Monogram letter="РК" size="md" color="secondary" />
            <Monogram letter="РК" size="md" color="tertiary" />
            <Monogram letter="РК" size="md" color="primary" />
            <Monogram letter="РК" size="md" color="secondary" />
            <Monogram letter="РК" size="md" color="tertiary" />
            <Monogram letter="РК" size="md" color="primary" />
            <Monogram letter="РК" size="md" color="secondary" />
            <Monogram letter="РК" size="md" color="tertiary" />
            <Monogram letter="РК" size="md" color="primary" />
            <Monogram letter="РК" size="md" color="secondary" />
            <Monogram letter="РК" size="md" color="tertiary" />
            <Monogram letter="РК" size="md" color="primary" />
            <Monogram letter="РК" size="md" color="secondary" />
            <Monogram letter="РК" size="md" color="tertiary" />
          </div>
        </div>
      </Section>
      <Section title="Рекомендуем" title_size="md"></Section>
    </>
  )
}
