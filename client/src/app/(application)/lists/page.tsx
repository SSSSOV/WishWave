"use client"

import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { handleSetPageTitle } from "@/context/page"
import { $isAuth } from "@/context/user"
import { $wishLists, handleCreateWishList, handleFetchWishLists, handleSetWishList } from "@/context/wish_lists"
import { sortWishListsByDate } from "@/lib/utils/lists"
import { IWishList } from "@/types/wish_list"
import { useUnit } from "effector-react"
import type { Metadata } from "next"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListsPage() {
  // Роутер
  const router = useRouter()

  // Контекст
  const [setPageTitle] = useUnit([handleSetPageTitle])

  // Эффекты
  useEffect(() => {
    setPageTitle("Ваши списки")
  }, [])

  // Стор
  const [isAuth, wishLists, fetchWishLists, setWishList] = useUnit([$isAuth, $wishLists, handleFetchWishLists, handleSetWishList])
  const [search, setSearch] = useState("")
  const [shownLists, setShownLists] = useState<IWishList[] | null>(null)

  if (!isAuth) return <NonAuthPage text="Для того чтобы создавать и просматривать списки, пожалуйста, авторизуйтесь" />

  // Эффекты
  useEffect(() => {
    if (isAuth) fetchWishLists(null)
  }, [])

  // Обработчики событий
  const handleOpen = (id: number) => {
    setWishList(wishLists.find((list) => list.id == id) as IWishList)
    router.push(`/lists/${id}`)
  }

  useEffect(() => {
    if (search === "") {
      setShownLists(wishLists)
    } else {
      const searchTerm = search.toLowerCase()
      setShownLists(wishLists.filter((list) => list.name.toLowerCase().includes(searchTerm)))
    }
  }, [search, wishLists])

  return (
    <>
      <Section padding_top_size="lg" padding_bot_size="xs">
        <Input
          labelText="Название"
          leadingIcon="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}></Input>
        <Section withoutPad align_items="right">
          <Button
            variant="text"
            icon="add"
            onClick={() => {
              router.push("lists/add/")
            }}>
            Список
          </Button>
        </Section>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Все ваши списки" padding_top_size="xs">
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
                    list.accesslevelId == 1 ? "visibility" : list.accesslevelId == 2 ? "visibility_off" : list.accesslevelId == 3 ? "link" : "group"
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
