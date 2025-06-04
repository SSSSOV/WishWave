"use client"
import { useEffect, useRef, useState } from "react"
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
import Card from "@/components/ui/card/Card"
import CardsSection from "@/components/ui/card/CardsSection"
import { $wishLists, handleFetchWishLists } from "@/context/wish_lists"
import DropdownMenu from "@/components/ui/menu/Menu"
import { handleDuplicateWish } from "@/context/wish"
import { $isAuth } from "@/context/user"
import Footer from "@/components/shared/footer/footer"

export default function MainPage() {
  usePageTitle("Главная")
  const router = useRouter()

  const [recommendations, activities, wishLists, isAuth, fetchRecomendations, fetchActivities, fetchWishLists, duplicateWish] = useUnit([
    $recommendations,
    $activities,
    $wishLists,
    $isAuth,
    handleFetchRecomendations,
    handleFetchActivities,
    handleFetchWishLists,
    handleDuplicateWish,
  ])

  const [selectedWish, setSelectedWish] = useState<number | null>(null)

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
    if (!recommendations || recommendations.length == 0) fetchRecomendations()
  }, [recommendations])

  useEffect(() => {
    if (isAuth) {
      fetchActivities()
      fetchWishLists(null)
    }
  }, [isAuth])

  const colors = ["primary", "secondary", "tertiary"]

  const handleAddToList = (wishId: number, targetListId: number) => {
    duplicateWish({ wishId, targetListId })
  }

  return (
    <>
      {isAuth && (
        <Section title="Недавние обновления друзей" padding_top_size="lg">
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
                      url={activity.image ? process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + activity.image : ""}
                      onClick={() => {
                        router.push(`/users/${activity.id}`)
                      }}
                    />
                  ))
                : "Пусто"}
            </div>
          </div>
        </Section>
      )}

      <Section title="Популярно среди пользователей" padding_top_size="lg">
        <CardsSection>
          {recommendations && recommendations.length > 0
            ? recommendations.map((recommendation) => (
                <Card
                  key={recommendation.id}
                  headline={recommendation.name}
                  overline={recommendation.price ? String(recommendation.price) + " руб" : ""}
                  imageType={recommendation.image ? "image" : "icon"}
                  onCardClick={() => {
                    router.push(`/wish/${recommendation.id}`)
                  }}
                  onButtonClick={wishLists && wishLists.length > 0 ? () => setSelectedWish(recommendation.id) : undefined}
                  imageColor={colors[recommendation.id % 3] as icon_color}
                  imageIcon="featured_seasonal_and_gifts"
                  imageUrl={process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + recommendation.image}
                />
              ))
            : "пусто"}
        </CardsSection>
        {/* Меню для добавления в список */}
        {selectedWish && (
          <DropdownMenu
            items={wishLists ? wishLists : [{ id: 0, name: "Списков нет" }]}
            onSelect={(listId) => {
              handleAddToList(selectedWish, listId)
              setSelectedWish(null)
            }}>
            <div
              className="backdrop"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 99,
              }}
              onClick={() => {
                setSelectedWish(null)
              }}
            />
          </DropdownMenu>
        )}
      </Section>
      <Section withoutPad>
        <Footer></Footer>
      </Section>
    </>
  )
}
