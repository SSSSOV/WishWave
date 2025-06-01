"use client"

import Button from "@/components/ui/buttons/Button"
import List from "@/components/ui/list/List"
import ListItem, { icon_color } from "@/components/ui/list/ListItem"
import Loader from "@/components/ui/loader/Loader"
import DropdownMenu from "@/components/ui/menu/Menu"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import { $isAuth } from "@/context/user"
import { $wish, handleBookWish, handleCompleteWish, handleDeleteWish, handleDuplicateWish, handleFetchWish, handleUnbookWish } from "@/context/wish"
import { $wishLists, handleFetchWishLists } from "@/context/wish_lists"
import { usePageTitle } from "@/hooks/usePageTitle"
import { getInitials } from "@/lib/utils/getInitials"
import { hasNameContent } from "@/lib/utils/hasNameContent"
import { IUser } from "@/types/user"
import { IWish } from "@/types/wish"
import { useUnit } from "effector-react"
import { jwtDecode } from "jwt-decode"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function WishPage() {
  // Роутер
  const router = useRouter()

  // Переменные
  const { id, shareToken } = useParams() // Получаем ID из URL
  const [isOwner, setIsOwner] = useState(false)
  const [isBooker, setBooker] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  // Стор
  const [wish, wishLists, isAuth, fetchWish, deleteWish, bookWish, unbookWish, completeWish, fetchWishLists, duplicateWish] = useUnit([
    $wish,
    $wishLists,
    $isAuth,
    handleFetchWish,
    handleDeleteWish,
    handleBookWish,
    handleUnbookWish,
    handleCompleteWish,
    handleFetchWishLists,
    handleDuplicateWish,
  ])

  const [selectedWish, setSelectedWish] = useState<number | null>(null)

  usePageTitle(wish ? wish.name : "Желание")

  // Эффекты

  useEffect(() => {
    fetchWish({ id: Number(id), shareToken: String(shareToken) })
  }, [])

  useEffect(() => {
    if (isAuth) fetchWishLists(null)
  }, [isAuth])

  useEffect(() => {
    if (wish) console.log(wish)
  }, [wish])

  useEffect(() => {
    if (typeof window !== "undefined" && wish) {
      const authToken = localStorage.getItem("auth")
      if (authToken && wish.owner) {
        const userId = jwtDecode<IUser>(authToken).id
        setIsOwner(wish.owner.id === userId)
        if (wish.bookedByUser) setBooker(wish.bookedByUser.id === userId)
      }
    }
  }, [wish])

  // Обработчики

  const handleOpenProduct = (url: string) => {
    window.open(url, "_blank")?.focus()
  }

  const handleEdit = (id: number) => {
    router.push(`/wish/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    deleteWish(id)
    router.back()
  }

  const handleCopyToClipboard = async (text: string) => {
    if (!text) return

    try {
      // Создаем временный input элемент
      const tempInput = document.createElement("input")
      tempInput.value = String(text)
      document.body.appendChild(tempInput)
      tempInput.select()

      // Пробуем использовать современный API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(String(text))
      }
      // Fallback для старых браузеров
      else {
        document.execCommand("copy")
      }

      document.body.removeChild(tempInput)
      toast.success("Название успешно скопировано!")

      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error("Не удалось скопировать название")
      console.error("Copy error:", err)
    }
  }

  const handleAddToList = (wishId: number, targetListId: number) => {
    duplicateWish({ wishId, targetListId })
  }

  const handleBook = async (id: number) => {
    bookWish(id)
    toast.success("Успешно забронировано!")
  }
  const handleUnbook = async (id: number) => {
    unbookWish(id)
    toast.success("Успешно разбронировано!")
  }
  const handleComplete = async (id: number) => {
    completeWish(id)
    toast.success("Успешно завершено!")
  }
  const handleUncomplete = async (id: number) => {
    unbookWish(id)
    toast.success("Статус изменен!")
  }

  const colors = ["primary", "secondary", "tertiary"]

  if (!wish || wish.id != Number(id)) {
    return <Loader></Loader>
  }

  return (
    <>
      <Section align_items="center" padding_top_size="lg">
        <Section withoutPad align_items="center">
          <Monogram
            monogram_type={wish.image ? "image" : "icon"}
            icon="featured_seasonal_and_gifts"
            size="full"
            url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.image}
            color={colors[wish.id % 3] as icon_color}
            isRounded
          />
        </Section>
      </Section>
      <Section>
        <List withoutPad>
          {wish && wish.owner && !isOwner ? (
            <ListItem
              nowrap
              condition={2}
              leading_type={wish.owner.image && wish.owner.image != "" ? "image" : hasNameContent(wish.owner.fullname) ? "monogram" : "icon"}
              leading={hasNameContent(wish.owner.fullname) ? getInitials(wish.owner.fullname) : "person"}
              url={wish.owner.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.owner.image : ""}
              headline={wish.owner.fullname ? (hasNameContent(wish.owner.fullname) ? wish.owner.fullname : wish.owner.login) : wish.owner.login}
              overline="владелец желания"
            />
          ) : null}
          <ListItem
            nowrap
            condition={2}
            headline={wish.name}
            onClick={() => {
              handleCopyToClipboard(wish.name)
            }}
            trailing_type="icon"
            trailing_color="primary"
            trailing={isCopied ? "check" : "content_copy"}
            overline="название"
          />
          <ListItem condition={2} headline={wish.price ? String(wish.price) + " руб." : "Не указано"} overline="цена" />
          {wish.productLink ? (
            <ListItem
              nowrap
              condition={2}
              headline={wish.productLink ? wish.productLink : "Не указано"}
              overline="ссылка"
              trailing_type="icon"
              trailing_color="primary"
              trailing="open_in_new"
              onClick={() => handleOpenProduct(wish.productLink ? wish.productLink : "")}
            />
          ) : (
            <ListItem condition={2} headline={wish.productLink ? wish.productLink : "Не указано"} overline="ссылка" />
          )}
          {wish ? (
            wish.wishStatusId == 1 ? ( // Если желание не забронировано
              <ListItem
                nowrap
                condition={2}
                headline={"Нажмите, чтобы забронировать"}
                overline="бронирование"
                trailing_type="icon"
                trailing="radio_button_unchecked"
                onClick={() => handleBook(wish.id)}
              />
            ) : wish.wishStatusId == 2 && wish.bookedByUser && !isBooker && !isOwner ? ( // Если желание забронировано но не пользователем
              <ListItem
                nowrap
                condition={2}
                leading_type={
                  wish.bookedByUser.image && wish.bookedByUser.image != ""
                    ? "image"
                    : hasNameContent(wish.bookedByUser.fullname)
                    ? "monogram"
                    : "icon"
                }
                leading={hasNameContent(wish.bookedByUser.fullname) ? getInitials(wish.bookedByUser.fullname) : "person"}
                url={wish.bookedByUser.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.bookedByUser!.image : ""}
                headline={
                  (wish.bookedByUser.fullname
                    ? hasNameContent(wish.bookedByUser.fullname)
                      ? wish.bookedByUser.fullname
                      : wish.bookedByUser.login
                    : wish.bookedByUser.login) + " забронировал"
                }
                overline="бронирование"
                trailing_type="icon"
                trailing_color="tertiary"
                trailing="radio_button_checked"
              />
            ) : wish.wishStatusId == 2 && wish.bookedByUser && isBooker && !isOwner ? ( // Если желание забронировано пользователем
              <ListItem
                nowrap
                condition={2}
                leading_type={
                  wish.bookedByUser.image && wish.bookedByUser.image != ""
                    ? "image"
                    : hasNameContent(wish.bookedByUser.fullname)
                    ? "monogram"
                    : "icon"
                }
                leading={hasNameContent(wish.bookedByUser.fullname) ? getInitials(wish.bookedByUser.fullname) : "person"}
                url={wish.bookedByUser.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.bookedByUser.image : ""}
                headline={"Вы забронировали"}
                onClick={() => {
                  handleUnbook(wish.id)
                }}
                overline="бронирование"
                trailing_type="icon"
                trailing_color="error"
                trailing="cancel"
              />
            ) : wish.wishStatusId == 2 && wish.bookedByUser && isOwner ? ( // Если желание забронировано и смотрит владелец
              <ListItem
                nowrap
                condition={2}
                leading_type={
                  wish.bookedByUser.image && wish.bookedByUser.image != ""
                    ? "image"
                    : hasNameContent(wish.bookedByUser.fullname)
                    ? "monogram"
                    : "icon"
                }
                leading={hasNameContent(wish.bookedByUser.fullname) ? getInitials(wish.bookedByUser.fullname) : "person"}
                url={wish.bookedByUser.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.bookedByUser.image : ""}
                headline={"Вы забронировали"}
                onClick={() => {
                  handleUnbook(wish.id)
                }}
                overline="бронирование"
                trailing_type="icon"
                trailing_color="error"
                trailing="cancel"
              />
            ) : wish.wishStatusId == 3 && wish.bookedByUser ? (
              <ListItem
                nowrap
                condition={2}
                leading_type={
                  wish.bookedByUser.image && wish.bookedByUser.image != ""
                    ? "image"
                    : hasNameContent(wish.bookedByUser.fullname)
                    ? "monogram"
                    : "icon"
                }
                leading={hasNameContent(wish.bookedByUser.fullname) ? getInitials(wish.bookedByUser.fullname) : "person"}
                url={wish.bookedByUser.image ? process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.bookedByUser.image : ""}
                headline={
                  (wish.bookedByUser.fullname
                    ? hasNameContent(wish.bookedByUser.fullname)
                      ? wish.bookedByUser.fullname
                      : wish.bookedByUser.login
                    : wish.bookedByUser.login) + " выполнил"
                }
                overline="бронирование"
                trailing_type="icon"
                trailing_color="primary"
                trailing="check_circle"
              />
            ) : null
          ) : null}
        </List>
      </Section>

      <Section>
        <hr />
      </Section>
      <Section align_items="right" padding_bot_size="lg" padding_top_size="md">
        <Section items_direction="row" withoutPad isFit>
          {isOwner && (
            <>
              {wish.wishStatusId == 2 && wish.bookedByUser ? (
                <Button variant="text" icon="check_circle" onClick={() => handleComplete(wish.id)}>
                  выполнено
                </Button>
              ) : wish.wishStatusId == 3 ? (
                <Button variant="text" icon="cancel" onClick={() => handleUncomplete(wish.id)} color="error">
                  не выполнено
                </Button>
              ) : null}
            </>
          )}
          {isAuth && <Button variant="text" icon="docs_add_on" onClick={() => setSelectedWish(wish.id)} />}
          {isOwner && (
            <>
              <Button variant="text" icon="edit" onClick={() => handleEdit(wish.id)} />
              <Button variant="text" icon="delete" color="error" onClick={() => handleDelete(wish.id)} />
            </>
          )}
          {/* Меню для добавления в список */}
          {selectedWish && (
            <DropdownMenu
              items={wishLists}
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
              />
            </DropdownMenu>
          )}
        </Section>
      </Section>
    </>
  )
}
