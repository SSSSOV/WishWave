"use client"

import Button from "@/components/ui/buttons/Button"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem, { icon_color } from "@/components/ui/list/ListItem"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $wishList, handleDeleteWishList, handleFetchWishList, handleResetWishList } from "@/context/wish_lists"
import { usePageTitle } from "@/hooks/usePageTitle"
import { getInitials } from "@/lib/utils/getInitials"
import { hasNameContent } from "@/lib/utils/hasNameContent"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListsPage() {
  // Заголовок страницы
  usePageTitle("Списки желаний")

  // Роутер
  const router = useRouter()

  // Сторы
  const [wishList, fetchWishList, deleteWishList, resetWishList] = useUnit([
    $wishList,
    handleFetchWishList,
    handleDeleteWishList,
    handleResetWishList,
  ])

  // Состояние
  const [search, setSearch] = useState("")

  // Обработчики
  const handleSearch = () => {
    if (Number(search)) fetchWishList(Number(search))
  }
  const handleDelete = (id: number) => {
    deleteWishList(id)
    router.back()
  }
  const handleOpen = (wishId: number) => {
    router.push(`/wish/${wishId}`)
  }

  // Эффекты
  useEffect(() => {
    return resetWishList()
  }, [])

  const colors = ["primary", "secondary", "tertiary"]
  const access_lvls = ["Публичный", "Приватный", "По ссылке", "Для друзей"]

  return (
    <>
      <TopAppBar />
      <Content>
        <Container withoutBg>
          <Section padding_top_size="lg" items_direction="row" align_items="center">
            <Input
              labelText="ID списка"
              isFull
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <Button icon="search" onClick={handleSearch} />
          </Section>
          {wishList && (
            <>
              <Section padding_top_size="sm">
                <List withoutPad>
                  {wishList && wishList.owner ? (
                    <ListItem
                      condition={2}
                      leading_type={
                        wishList.owner.image && wishList.owner.image != "" ? "image" : hasNameContent(wishList.owner.fullname) ? "monogram" : "icon"
                      }
                      leading={hasNameContent(wishList.owner.fullname) ? getInitials(wishList.owner.fullname) : "person"}
                      url={wishList.owner.image ? process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + wishList.owner.image : ""}
                      headline={wishList.owner.fullname ? wishList.owner.fullname : wishList.owner.login}
                      overline="владелец списка"
                    />
                  ) : null}
                  <ListItem condition={2} headline={wishList.name} overline="название" />
                  <ListItem
                    condition={2}
                    headline={
                      wishList.eventDate != null
                        ? new Date(wishList.eventDate).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Не указано "
                    }
                    overline="дата события"
                  />
                  <ListItem condition={2} headline={access_lvls[wishList.accessLevelId - 1]} overline="доступ" />
                  <ListItem condition={2} headline={wishList.description ? wishList.description : "Не указано"} overline="описание" />
                </List>
              </Section>
              <Section>
                <hr />
              </Section>
              <Section align_items="right">
                <Section items_direction="row" withoutPad isFit>
                  <Button variant="text" icon="delete" color="error" onClick={() => handleDelete(wishList.id)}></Button>
                </Section>
              </Section>
              <Section>
                <hr />
              </Section>
              <Section title="желания" padding_top_size="lg" padding_bot_size="lg">
                <List withoutPad>
                  {wishList.wishes && wishList.wishes.length > 0 ? (
                    wishList.wishes.map((wish) => (
                      <ListItem
                        nowrap
                        key={wish.id}
                        condition={2}
                        headline={wish.name}
                        overline={`${wish.price ? `${wish.price} ₽` : ""}`}
                        leading_type={wish.image ? "image" : "icon"}
                        leading="featured_seasonal_and_gifts"
                        trailing_type="icon"
                        url={process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + wish.image}
                        leading_color={colors[wish.id % 3] as icon_color}
                        onClick={() => handleOpen(wish.id)}
                      />
                    ))
                  ) : (
                    <p>В этом списке пока нет желаний</p>
                  )}
                </List>
              </Section>
            </>
          )}
        </Container>
      </Content>
    </>
  )
}
