"use client"
import Button from "@/components/ui/buttons/Button"
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Content from "@/components/ui/content/Content"
import Input from "@/components/ui/inputs/Input"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import styles from "@/app/home.module.css"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useUnit } from "effector-react"
import { $isAuth, $user, handleCheckAuth, handleSignIn } from "@/context/user"
import toast from "react-hot-toast"
import Container from "@/components/ui/container/Container"
import Loader from "@/components/ui/loader/Loader"

export default function LoginPage() {
  // Маршрутизатор
  const router = useRouter()

  // Переменные
  const [loginOrEmail, setLogin] = useState("")
  const [password, setPassword] = useState("")

  // Контекст
  const [handle, checkAuth, isAuth] = useUnit([handleSignIn, handleCheckAuth, $isAuth])

  // Обработчик авторизации
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      handle({ loginOrEmail, password })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    console.log(isAuth)
    if (isAuth) router.replace("main/")
  }, [isAuth])

  return (
    <>
      <ThemeToggle isAbsolute></ThemeToggle>
      <Content topBarSize="none" navigationType="none" withPad isScreen>
        <Container withRadius>
          {/* <Section align_items="right" items_direction="row" padding_bot_size="lg" padding_top_size="lg">
            <Monogram monogram_type="monogram" letter="ww" size="md" color="primary"></Monogram>
            <Monogram monogram_type="icon" icon="person" size="md" color="secondary"></Monogram>
            <Monogram monogram_type="icon" icon="login" size="md" color="tertiary"></Monogram>
          </Section> */}
          <Loader fit></Loader>
          {/* <Section title="WishWave" title_size="lg" align_items="center" items_direction="col" padding_bot_size="lg" padding_top_size="lg"></Section> */}
          <form action="login" onSubmit={handleSubmit}>
            <Section title="Уже есть аккаунт? Входите!" title_size="md" padding_top_size="lg">
              <Input
                labelText="Логин или почта"
                leadingIcon="person"
                type="text"
                id="login"
                value={loginOrEmail}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
              <Input
                labelText="Пароль"
                leadingIcon="password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button variant="text" isPadNone type="button">
                Забыли пароль?
              </Button>
              <Button variant="filled" isFit={false} type="submit">
                Войти
              </Button>
            </Section>
          </form>
          <Section align_items="center" padding_top_size="lg">
            <Section items_direction="row" isFit>
              Нет аккаунта?
              <Button variant="text" isPadNone onClick={() => router.replace("/signup")}>
                Создайте его
              </Button>
            </Section>
          </Section>
          <Section align_items="center" padding_bot_size="lg" padding_top_size="lg">
            <span className={styles.text_center + " " + styles.label}>
              Продолжая, вы соглашаетесь с{" "}
              <a className={styles.link} href="/documents#terms" target="_blank" rel="noopener noreferrer">
                Условиями обслуживания WishWave
              </a>{" "}
              и подтверждаете, что ознакомились с нашей{" "}
              <a className={styles.link} href="/documents#policy" target="_blank" rel="noopener noreferrer">
                Политикой конфиденциальности
              </a>
              .
            </span>
          </Section>
        </Container>
      </Content>
    </>
  )
}
