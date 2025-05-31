"use client"
import { useEffect, useRef } from "react"
import { useUnit } from "effector-react"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import styles from "@/app/home.module.css"
import { $pageTitle, handleSetPageTitle } from "@/context/page"
import Button from "@/components/ui/buttons/Button"
import { usePageTitle } from "@/hooks/usePageTitle"
import FABButton from "@/components/ui/buttons/FABButton"
import ListItem, { icon_color } from "@/components/ui/list/ListItem"
import List from "@/components/ui/list/List"
import { $activities, $recommendations, handleFetchActivities, handleFetchRecomendations } from "@/context/recommendations"
import { useRouter } from "next/navigation"
import { hasNameContent } from "@/lib/utils/hasNameContent"

export default function MainPage() {
  usePageTitle("Главная")
  const router = useRouter()

  const [recommendations, activities, fetchRecomendations, fetchActivities] = useUnit([
    $recommendations,
    $activities,
    handleFetchRecomendations,
    handleFetchActivities,
  ])

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      // Предотвращаем вертикальный скролл страницы
      // e.preventDefault();
      // Скроллим контейнер по горизонтали
      scrollContainerRef.current.scrollLeft += e.deltaY
    }
  }

  useEffect(() => {
    fetchRecomendations()
    fetchActivities()
  }, [])

  const colors = ["primary", "secondary", "tertiary"]

  return (
    <>
      <Section title="Недавние обновления друзей">
        <div className={styles.row}>
          <div ref={scrollContainerRef} className={styles.scrollContainer} onWheel={handleWheel}>
            {activities && activities.length > 0
              ? activities.map((activity) => (
                  <Monogram
                    key={activity.id}
                    color={colors[activity.id % 3] as icon_color}
                    size="md"
                    icon="person"
                    monogram_type={activity.image ? "image" : hasNameContent(activity.fullname) ? "monogram" : "icon"}
                    url={activity.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + activity.image : ""}
                    onClick={() => {
                      router.push(`/users/${activity.id}`)
                    }}
                  />
                ))
              : "Пусто"}
          </div>
        </div>
      </Section>
      <Section title="Рекомендуем">
        <List withoutPad>
          {recommendations && recommendations.length > 0
            ? recommendations.map((recommendation) => (
                <ListItem
                  key={recommendation.id}
                  condition={2}
                  headline={recommendation.name}
                  overline={recommendation.price ? String(recommendation.price) : ""}
                  trailing_type="icon"
                  onClick={() => {
                    router.push(`/wish/${recommendation.id}`)
                  }}
                  leading_type={recommendation.image ? "image" : "icon"}
                  leading_color={colors[recommendation.id % 3] as icon_color}
                  leading="featured_seasonal_and_gifts"
                  url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + recommendation.image}
                />
              ))
            : "пусто"}
        </List>
      </Section>
    </>
  )
}
