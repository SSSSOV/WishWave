"use client"

import Button from "@/components/ui/buttons/Button"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $user, handleDeleteUser, handleFetchUser, handleResetUser } from "@/context/user"
import { usePageTitle } from "@/hooks/usePageTitle"
import { getInitials } from "@/lib/utils/getInitials"
import { hasNameContent } from "@/lib/utils/hasNameContent"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

export default function UsersPage() {
  // Заголовок страницы
  usePageTitle("Пользователи")

  // Роутер
  const router = useRouter()

  // Сторы
  const [user, fetchUser, deleteUser, resetUser] = useUnit([$user, handleFetchUser, handleDeleteUser, handleResetUser])

  // Состояние
  const [search, setSearch] = useState("")
  const [confirm, setConfirm] = useState(false)

  // Обработчики
  const handleSearch = () => {
    if (Number(search)) fetchUser(Number(search))
  }
  const handleDelete = (id: number) => {
    if (confirm) {
      deleteUser(id)
      router.back()
    } else {
      setConfirm(true), setTimeout(() => setConfirm(false), 2000)
    }
  }

  // Эффекты
  useEffect(() => {
    return resetUser()
  }, [])

  return (
    <>
      <TopAppBar />
      <Content>
        <Container withoutBg>
          <Section padding_top_size="lg" items_direction="row" align_items="center">
            <Input
              labelText="ID пользователя"
              isFull
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <Button icon="search" onClick={handleSearch} />
          </Section>

          {user && (
            <>
              <Section align_items="center" padding_top_size="lg">
                <Monogram
                  monogram_type={user.image ? "image" : hasNameContent(user.fullname) ? "monogram" : "icon"}
                  letter={hasNameContent(user.fullname) ? getInitials(user.fullname) : "person"}
                  icon="person"
                  size="full"
                  isRounded
                  url={process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + user.image}
                />
              </Section>
              <Section>
                <hr />
              </Section>
              <Section title="Основная информация" title_size="sm">
                <List withoutPad>
                  <ListItem
                    condition={2}
                    overline="фото профиля"
                    leading_type={user.image && user.image != "" ? "image" : hasNameContent(user.fullname) ? "monogram" : "icon"}
                    leading={hasNameContent(user.fullname) ? getInitials(user.fullname) : "person"}
                    url={process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + user.image}
                    headline="Персонализирует аккаунт"
                    trailing_type={user.image ? "icon" : undefined}
                    onClick={
                      user.image
                        ? () => {
                            router.push(process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + user.image)
                          }
                        : undefined
                    }
                  />

                  {user.fullname && hasNameContent(user.fullname) && <ListItem condition={2} overline="имя" headline={user.fullname} />}
                  {user.birthday && (
                    <ListItem
                      condition={2}
                      overline="дата рождения"
                      headline={new Date(user.birthday).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    />
                  )}
                  {user.gender && <ListItem condition={2} overline="пол" headline={user.gender == "male" ? "Мужской" : "Женский"} />}
                  <ListItem condition={2} overline="логин" headline={user.login} />
                </List>
              </Section>
              <Section>
                <List withoutPad>
                  {user.email && <ListItem condition={2} overline="почта" headline={user.email} />}
                  {user.phone && <ListItem condition={2} overline="телефон" headline={user.phone} />}
                </List>
              </Section>
              <Section>
                <hr />
              </Section>
              <Section padding_bot_size="sm" align_items="right">
                <Section items_direction="row" isFit withoutPad>
                  <Button variant="text" color="error" icon={confirm ? "warning" : "delete"} onClick={() => handleDelete(user.id)}>
                    {confirm ? "Подтвердить удаление" : "Удалить аккаунт"}
                  </Button>
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
