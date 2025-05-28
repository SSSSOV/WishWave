"use client"
import Button from "@/components/ui/buttons/Button"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import style from "@/app/home.module.css"
import { useRouter } from "next/navigation"
import { useUnit } from "effector-react"
import { $isAuth, $user, handleFetchUser, handleLogeOut, logOutFx } from "@/context/user"
import { hasNameContent } from "@/lib/utils/hasNameContent"
import { getInitials } from "@/lib/utils/getInitials"
import { $pageTitle, handleClearPageTitle, handleSetPageTitle } from "@/context/page"
import { usePageTitle } from "@/hooks/usePageTitle"
import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import { startLoading } from "@/context/loading"
import { useUser } from "@/hooks/useUser"
import { useEffect } from "react"

export default function ProfilePage() {
  usePageTitle("Ваш профиль")

  // Хуки
  const router = useRouter()
  const user = useUser()

  // Переменные

  // Обработчики
  const handleExit = () => {
    user.logOut()
    window.location.href = "/login"
  }

  // Хуки

  return (
    <>
      <Section align_items="center" padding_top_size="lg">
        <Monogram
          monogram_type={user.data!.image ? "image" : hasNameContent(user.data!.fullname) ? "monogram" : "icon"}
          letter={hasNameContent(user.data!.fullname) ? getInitials(user.data!.fullname) : "person"}
          icon="person"
          size="lg"
          url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + user.data!.image}
        />
      </Section>
      <Section align_items="center">
        <span className={style.title}>
          {user.data!.fullname && user.data!.fullname != " " && user.data!.fullname != "" ? user.data!.fullname : ""}
        </span>
        <span className={style.body}>{user.data!.login}</span>
      </Section>
      <Section title="Информация вашего профиля в сервсие WishWave" title_size="md" padding_top_size="lg" padding_bot_size="lg">
        <span className={style.body}>
          Здесь можно посмотреть или изменить личную информацию.
          {/*Некоторые данные, например контактные, можно сделать доступными всем, чтобы с вами
          было проще связаться. */}
        </span>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Основная информация" title_size="sm" padding_top_size="lg">
        <span className={style.label}>Некоторая информация может быть видна другим пользователям сервиса WishWave. Узнать больше</span>
        <List withoutPad>
          <ListItem
            condition={2}
            overline="фото профиля"
            leading_type={user.data!.image && user.data!.image != "" ? "image" : hasNameContent(user.data!.fullname) ? "monogram" : "icon"}
            leading={hasNameContent(user.data!.fullname) ? getInitials(user.data!.fullname) : "person"}
            url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + user.data!.image}
            headline="Персонализирует ваш аккаунт"
            trailing_type="icon"
            onClick={() => {
              router.push("/profile/image")
            }}
          />

          <ListItem
            condition={2}
            overline="имя"
            headline={user.data!.fullname && hasNameContent(user.data!.fullname) ? user.data!.fullname : "Не указано"}
            trailing_type="icon"
            onClick={() => {
              router.push("/profile/name")
            }}
          />
          <ListItem
            condition={2}
            overline="дата рождения"
            headline={
              user.data!.birthday
                ? new Date(user.data!.birthday).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Не указано"
            }
            trailing_type="icon"
            onClick={() => {
              router.push("/profile/birthday")
            }}
          />
          <ListItem
            condition={2}
            overline="пол"
            headline={user.data!.gender ? (user.data!.gender == "male" ? "Мужской" : "Женский") : "Не указано"}
            trailing_type="icon"
            onClick={() => {
              router.push("/profile/gender")
            }}
          />
          <ListItem condition={2} overline="логин" headline={user.data!.login ? user.data!.login : "Не указано"} />
          <ListItem
            condition={2}
            overline="пароль"
            headline={"Нажмите, чтобы изменить"}
            trailing_type="icon"
            onClick={() => {
              router.push("/profile/password")
            }}
          />
        </List>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Контактная информация" title_size="sm" padding_top_size="lg">
        <List withoutPad>
          <ListItem condition={2} overline="почта" headline={user.data!.email ? user.data!.email : "Не указано"} />
          <ListItem
            condition={2}
            overline="телефон"
            headline={user.data!.phone ? user.data!.phone : "Не указано"}
            trailing_type="icon"
            onClick={() => {
              router.push("/profile/phone")
            }}
          />
        </List>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section padding_bot_size="lg" align_items="right">
        <Section items_direction="row" isFit withoutPad>
          <Button variant="text" color="error" icon="delete">
            Удалить аккаунт
          </Button>
          <Button variant="text" color="error" onClick={handleExit} icon="logout">
            Выйти
          </Button>
        </Section>
      </Section>
    </>
  )
}
