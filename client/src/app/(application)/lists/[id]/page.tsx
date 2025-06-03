"use client"

import Button from "@/components/ui/buttons/Button"
import List from "@/components/ui/list/List"
import ListItem, { icon_color } from "@/components/ui/list/ListItem"
import Loader from "@/components/ui/loader/Loader"
import Section from "@/components/ui/section/Section"
import { $isLoading, startLoading, stopLoading } from "@/context/loading"
import { handleSetPageTitle } from "@/context/page"
import { $wish } from "@/context/wish"
import {
  $wishList,
  $wishLists,
  fetchWishListFx,
  handleDeleteWishList,
  handleFetchWishList,
  handleFetchWishLists,
  handleSetWishList,
} from "@/context/wish_lists"
import { usePageTitle } from "@/hooks/usePageTitle"
import { getInitials } from "@/lib/utils/getInitials"
import { hasNameContent } from "@/lib/utils/hasNameContent"
import { IUser } from "@/types/user"
import { IWishList } from "@/types/wish_list"
import { useUnit } from "effector-react"
import { jwtDecode } from "jwt-decode"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function WishListPage() {
  // Роутер
  const router = useRouter()

  // Переменные
  const { id } = useParams() // Получаем ID из URL
  const [isOwner, setIsOwner] = useState(false)

  // Стор
  const [wishList, wish, deleteWishList, fetchWishList, setPageTitle] = useUnit([
    $wishList,
    $wish,
    handleDeleteWishList,
    handleFetchWishList,
    handleSetPageTitle,
  ])

  const handleDelete = () => {
    deleteWishList(Number(id))
    router.back()
  }

  const handleEdit = () => {
    router.push(`/lists/${id}/edit`)
  }

  const handleOpen = (wishId: number) => {
    router.push(`/wish/${wishId}`)
  }

  useEffect(() => {
    if (id) {
      fetchWishList(Number(id))
    }
  }, [id])

  useEffect(() => {
    if (typeof window !== "undefined" && wishList) {
      const authToken = localStorage.getItem("auth")
      if (authToken && wishList.owner) {
        const userId = jwtDecode<IUser>(authToken).id
        setIsOwner(wishList.owner.id === userId)
      }
    }
    if (wishList && wishList.id == Number(id)) {
      setPageTitle(wishList.name)
    }
  }, [wishList])

  const colors = ["primary", "secondary", "tertiary"]
  const access_lvls = ["Публичный", "Приватный", "По ссылке", "Для друзей"]

  if (!wishList) return <Loader></Loader>

  if (!wishList) {
    return (
      <Section align_items="center" padding_top_size="lg">
        <p>Список не найден</p>
        <Button variant="text" onClick={() => router.push("/lists")}>
          Вернуться к спискам
        </Button>
      </Section>
    )
  }

  return (
    <>
      <Section padding_top_size="sm">
        <List withoutPad>
          {wishList && wishList.owner && !isOwner ? (
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
      {isOwner ? (
        <>
          <Section>
            <hr />
          </Section>
          <Section align_items="right">
            <Section items_direction="row" withoutPad isFit>
              <Button variant="text" icon="add" onClick={() => router.push(`/add/?listId=${id}`)}>
                Желание
              </Button>
              <Button variant="text" icon="edit" onClick={handleEdit}></Button>
              <Button variant="text" icon="delete" color="error" onClick={handleDelete}></Button>
            </Section>
          </Section>
        </>
      ) : null}
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
  )
}
