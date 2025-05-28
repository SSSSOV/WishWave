"use client"

import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import { $friend, handleFetchFriend, handleUnfriend } from "@/context/friends"
import { useUnit } from "effector-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IWishList } from "@/types/wish_list"
import { sortWishListsByDate } from "@/lib/utils/lists"
import { $wishLists, handleFetchWishLists, handleSetWishList } from "@/context/wish_lists"
import toast from "react-hot-toast"
import { hasNameContent } from "@/lib/utils/hasNameContent"
import { getInitials } from "@/lib/utils/getInitials"
import Loader from "@/components/ui/loader/Loader"
import { usePageTitle } from "@/hooks/usePageTitle"
import { jwtDecode } from "jwt-decode"
import { IUser } from "@/types/user"
import Button from "@/components/ui/buttons/Button"

export default function UserPage() {
  // Роутер
  const router = useRouter()

  // Переменные
  const { id } = useParams() // Получаем ID из URL

  const [friend, wishLists, fetchFriend, fetchWishLists, setWishList, unfriend] = useUnit([
    $friend,
    $wishLists,
    handleFetchFriend,
    handleFetchWishLists,
    handleSetWishList,
    handleUnfriend,
  ])

  const [shownLists, setShownLists] = useState<IWishList[] | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  // Эффекты
  useEffect(() => {
    if (!friend || friend.id != Number(id)) fetchFriend(Number(id))
    if (typeof window !== "undefined" && friend) {
      const authToken = localStorage.getItem("auth")
      if (authToken) {
        const userId = jwtDecode<IUser>(authToken).id
        setIsOwner(friend.id === userId)
      }
    }
    if (friend && friend.id == Number(id)) fetchWishLists(Number(id))
  }, [friend])

  useEffect(() => {
    if (wishLists) setShownLists(wishLists)
    console.log(wishLists)
  }, [wishLists])

  const handleOpen = (listId: number) => {
    const list = wishLists?.find((list) => list.id == listId)
    if (list) {
      setWishList(list)
      router.push(`/lists/${listId}`)
    } else toast.error("Список не найден!")
  }

  usePageTitle(friend ? friend.login : "Пользователь")

  const handleRemove = (id: number) => {
    unfriend(id)
    router.back()
  }

  if (!friend || friend.id != Number(id)) return <Loader />

  return (
    <>
      <Section padding_top_size="lg">
        <Section align_items="center" withoutPad>
          <Monogram
            monogram_type={friend.image ? "image" : hasNameContent(friend.fullname) ? "monogram" : "icon"}
            letter={hasNameContent(friend.fullname) ? getInitials(friend.fullname) : "person"}
            icon="person"
            size="lg"
            url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + friend.image}
          />
        </Section>
        <List withoutPad>
          <ListItem condition={2} headline={friend.login} overline="логин" />
          {friend.fullname ? <ListItem condition={2} headline={friend.fullname} overline="имя" /> : ""}
          {friend.birthday ? (
            <ListItem
              condition={2}
              headline={new Date(friend.birthday).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              overline="дата рождения"
            />
          ) : (
            ""
          )}
          {friend.gender ? <ListItem condition={2} headline={friend.gender} overline="дата рождения" /> : ""}
        </List>
      </Section>
      {!isOwner ? (
        <Section align_items="right">
          <Section items_direction="row" withoutPad isFit>
            <Button variant="text" icon="person_remove" onClick={() => handleRemove(friend.id)} color="error">
              Удалить из друзей
            </Button>
          </Section>
        </Section>
      ) : null}
      {/* <Section></Section> */}
      <Section>
        <hr />
      </Section>
      <Section title={`Списки желаний пользовтеля ${friend.login}`} padding_top_size="md">
        <List withoutPad>
          {shownLists && shownLists.length > 0 ? (
            sortWishListsByDate(shownLists, "asc").map((list) => {
              return (
                <ListItem
                  key={list.id}
                  condition={2}
                  headline={list.name}
                  overline={
                    list.eventDate != null
                      ? new Date(list.eventDate).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""
                  }
                  leading_type="icon"
                  leading={
                    list.accessLevelId == 1 ? "visibility" : list.accessLevelId == 2 ? "visibility_off" : list.accessLevelId == 3 ? "link" : "group"
                  }
                  trailing_type="icon"
                  onClick={() => handleOpen(list.id)}
                />
              )
            })
          ) : (
            <Section align_items="center" withoutPad>
              пусто
            </Section>
          )}
        </List>
      </Section>
    </>
  )
}
