"use client"

import Button from "@/components/ui/buttons/Button"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem, { icon_color } from "@/components/ui/list/ListItem"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $wish, handleDeleteWish, handleFetchWish, handleResetWish } from "@/context/wish"
import { usePageTitle } from "@/hooks/usePageTitle"
import { getInitials } from "@/lib/utils/getInitials"
import { hasNameContent } from "@/lib/utils/hasNameContent"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export default function WishesPage() {
  // Заголовок страницы
  usePageTitle("Желания")

  // Роутер
  const router = useRouter()

  // Сторы
  const [wish, fetchWish, deleteWish, resetWish] = useUnit([$wish, handleFetchWish, handleDeleteWish, handleResetWish])

  // Состояние
  const [search, setSearch] = useState("")

  // Обработчики
  const handleSearch = () => {
    if (Number(search)) fetchWish({ id: Number(search) })
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
    } catch (err) {
      toast.error("Не удалось скопировать название")
      console.error("Copy error:", err)
    }
  }
  const handleOpenProduct = (url: string) => {
    window.open(url, "_blank")?.focus()
  }
  const handleDelete = (id: number) => {
    deleteWish(id)
    router.back()
  }

  // Эффекты
  useEffect(() => {
    return resetWish()
  }, [])

  const colors = ["primary", "secondary", "tertiary"]

  return (
    <>
      <TopAppBar />
      <Content topBarSize="sm">
        <Container withoutBg>
          <Section padding_top_size="lg" items_direction="row" align_items="center">
            <Input
              labelText="ID желания"
              isFull
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <Button icon="search" onClick={handleSearch} />
          </Section>

          {wish && (
            <>
              <Section align_items="center" padding_top_size="lg">
                <Section withoutPad align_items="center">
                  <Monogram
                    monogram_type={wish.image ? "image" : "icon"}
                    icon="featured_seasonal_and_gifts"
                    size="full"
                    url={process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + wish.image}
                    color={colors[wish.id % 3] as icon_color}
                    isRounded
                  />
                </Section>
              </Section>
              <Section>
                <List withoutPad>
                  {wish && wish.owner ? (
                    <ListItem
                      nowrap
                      condition={2}
                      leading_type={wish.owner.image && wish.owner.image != "" ? "image" : hasNameContent(wish.owner.fullname) ? "monogram" : "icon"}
                      leading={hasNameContent(wish.owner.fullname) ? getInitials(wish.owner.fullname) : "person"}
                      url={wish.owner.image ? process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + wish.owner.image : ""}
                      headline={
                        wish.owner.fullname ? (hasNameContent(wish.owner.fullname) ? wish.owner.fullname : wish.owner.login) : wish.owner.login
                      }
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
                    trailing={"content_copy"}
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
                </List>
              </Section>

              <Section>
                <hr />
              </Section>
              <Section align_items="right" padding_bot_size="lg" padding_top_size="md">
                <Section items_direction="row" withoutPad isFit>
                  <Button variant="text" icon="delete" color="error" onClick={() => handleDelete(wish.id)} />
                </Section>
              </Section>
            </>
          )}
        </Container>
      </Content>
      <Toaster
        position="bottom-center"
        toastOptions={{
          // Define default options
          icon: null,
          className: "toast",
          duration: 2000,
          removeDelay: 1000,
        }}
      />
    </>
  )
}
