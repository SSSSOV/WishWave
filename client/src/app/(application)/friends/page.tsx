"use client"

import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $friends, handleFetchFriends } from "@/context/friends"
import { handleSetPageTitle } from "@/context/page"
import { $isAuth } from "@/context/user"
import { usePageTitle } from "@/hooks/usePageTitle"
import { IUser } from "@/types/user"
import { useUnit } from "effector-react"
import type { Metadata } from "next"
import { useRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"

export default function FriendsPage() {
  const router = useRouter()
  usePageTitle("Ваши друзья")
  // Контекст
  const [setPageTitle] = useUnit([handleSetPageTitle])

  // Эффекты
  useLayoutEffect(() => {}, [])

  const [search, setSearch] = useState("")
  const [shownFriends, setShownFriends] = useState<IUser[] | null>(null)

  const [isAuth, friends, fetchFriends] = useUnit([$isAuth, $friends, handleFetchFriends])

  useEffect(() => {
    if (isAuth) fetchFriends()
  }, [isAuth])

  useEffect(() => {
    if (search === "") {
      setShownFriends(friends)
    } else {
      const searchTerm = search.toLowerCase()
      setShownFriends(
        friends
          ? friends.filter(
              (friend) => friend.login.toLowerCase().includes(searchTerm) || (friend.fullname && friend.fullname.toLowerCase().includes(searchTerm))
            )
          : null
      )
    }
  }, [search, friends])

  const openUser = (id: number) => {
    router.push(`/users/${id}`)
  }

  if (!isAuth) {
    return <NonAuthPage text="Для того чтобы добавлять и просматривать друзей, пожалуйста, авторизуйтесь" />
  }

  return (
    <>
      <Section padding_top_size="lg">
        <Input
          labelText="Имя"
          leadingIcon="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
        <Section align_items="right" withoutPad>
          <Button
            variant="text"
            icon="add"
            onClick={() => {
              router.push("/friends/add/")
            }}>
            Друга
          </Button>
        </Section>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Ваши друзья" padding_bot_size="lg">
        <List withoutPad>
          {shownFriends && shownFriends.length > 0 ? (
            shownFriends.map((friend) => (
              <ListItem
                key={friend.id}
                url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + friend.image}
                leading_type={friend.image ? "image" : "icon"}
                leading="person"
                condition={2}
                headline={friend.fullname ? friend.fullname : friend.login}
                overline={friend.fullname ? friend.login : ""}
                trailing_type="icon"
                onClick={() => {
                  openUser(friend.id)
                }}
              />
            ))
          ) : (
            <Section align_items="center" title="Пусто" title_size="xs" withoutPad></Section>
          )}
        </List>
      </Section>
    </>
  )
}
