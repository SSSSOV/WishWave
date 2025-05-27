"use client"

import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $friends, handleFetchFriends } from "@/context/friends"
import { handleSetPageTitle } from "@/context/page"
import { useUnit } from "effector-react"
import type { Metadata } from "next"
import { useRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"

export default function FriendsPage() {
  const router = useRouter()

  // Контекст
  const [setPageTitle] = useUnit([handleSetPageTitle])

  // Эффекты
  useLayoutEffect(() => {
    setPageTitle("Ваши друзья")
  }, [])

  const [search, setSearch] = useState("")

  const [friends, fetchFriends] = useUnit([$friends, handleFetchFriends])

  useEffect(() => {
    fetchFriends()
  }, [])

  const openUser = (id: number) => {
    router.push(`/friends/${id}`)
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
      <Section title="Ваши друзья" padding_bot_size="lg">
        <List withoutPad>
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
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
