"use client"

import Button from "@/components/ui/buttons/Button"
import List from "@/components/ui/list/List"
import ListItem, { icon_color } from "@/components/ui/list/ListItem"
import Loader from "@/components/ui/loader/Loader"
import Section from "@/components/ui/section/Section"
import { $isLoading, startLoading, stopLoading } from "@/context/loading"
import { handleSetPageTitle } from "@/context/page"
import { $bookedWishes, $wish, handleFetchBookedWishes } from "@/context/wish"
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

export default function BookedPage() {
  usePageTitle("Забронированные")
  // Роутер
  const router = useRouter()

  // Переменные
  const { id } = useParams() // Получаем ID из URL
  const [isOwner, setIsOwner] = useState(false)

  // Стор
  const [wish, bookedWishes, fetchBookedWishes] = useUnit([$wish, $bookedWishes, handleFetchBookedWishes])

  useEffect(() => {
    fetchBookedWishes()
  }, [bookedWishes])

  const handleOpen = (wishId: number) => {
    router.push(`/wish/${wishId}`)
  }

  const colors = ["primary", "secondary", "tertiary"]
  const access_lvls = ["Публичный", "Приватный", "По ссылке", "Для друзей"]

  if (bookedWishes && bookedWishes.length == 0) return <Section title="Пусто" align_items="center"></Section>

  return (
    <>
      <Section title="забронированные вами желания" padding_top_size="lg" padding_bot_size="lg">
        <List withoutPad>
          {bookedWishes && bookedWishes.length > 0 ? (
            bookedWishes.map((wish) => (
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
