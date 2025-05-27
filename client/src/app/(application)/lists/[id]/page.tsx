"use client"

import Button from "@/components/ui/buttons/Button"
import List from "@/components/ui/list/List"
import ListItem, { list_item_icon_color } from "@/components/ui/list/ListItem"
import Section from "@/components/ui/section/Section"
import { $wishList, $wishLists, handleDeleteWishList, handleFetchWishList, handleFetchWishLists, handleSetWishList } from "@/context/wish_lists"
import { IWishList } from "@/types/wish_list"
import { useUnit } from "effector-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function WishListPage() {
  // Роутер
  const router = useRouter()

  // Переменные
  const { id } = useParams() // Получаем ID из URL

  // Стор
  const [wishList, wishLists, deleteWishList, setWishList, fetchWishList] = useUnit([
    $wishList,
    $wishLists,
    handleDeleteWishList,
    handleSetWishList,
    handleFetchWishList,
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
    fetchWishList(Number(id))
  }, [])

  useEffect(() => {
    if (wishLists && wishLists.length) setWishList(wishLists.find((list) => list.id == Number(id)) as IWishList)
  }, [wishLists])

  const colors = ["primary", "secondary", "tertiary"]
  const access_lvls = ["Публичный", "Приватный", "По ссылке", "Для друзей"]

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
      <Section withoutPad>
        <List>
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
          <ListItem condition={2} headline={access_lvls[wishList.accesslevelId - 1]} overline="доступ" />
          <ListItem condition={2} headline={wishList.description ? wishList.description : "Не указано"} overline="описание" />
        </List>
      </Section>
      <Section align_items="right">
        <Section items_direction="row" withoutPad isFit>
          <Button variant="text" icon="add" onClick={() => router.push(`/add/?listId=${id}`)}>
            Желание
          </Button>
          <Button variant="text" icon="edit" onClick={handleEdit}>
            Список
          </Button>
          <Button variant="text" icon="delete" color="error" onClick={handleDelete}>
            Список
          </Button>
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
                url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.image}
                color={colors[wish.id % 3] as list_item_icon_color}
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
