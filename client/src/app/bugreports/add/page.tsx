"use client"
import Button from "@/components/ui/buttons/Button"
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import Input from "@/components/ui/inputs/Input"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { usePageTitle } from "@/hooks/usePageTitle"
import style from "@/app/home.module.css"
import TextArea from "@/components/ui/inputs/TextArea"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { IJWT } from "@/types/user"
import { useUnit } from "effector-react"
import { handleCreateBugreport } from "@/context/bugreports"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"

export default function AddBugreportPage() {
  usePageTitle("Новый багрепорт")
  const router = useRouter()

  const [createBugrport] = useUnit([handleCreateBugreport])

  const [bugTitle, setBugTitle] = useState("")
  const [bugDesc, setBugDesc] = useState("")
  const [bugEmail, setBugEmail] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("auth")
    if (token) {
      const user = jwtDecode<IJWT>(token)
      setBugEmail(user.email)
    }
  }, [])

  const handleSend = () => {
    createBugrport({ title: bugTitle, description: bugDesc, email: bugEmail })
    router.back()
  }

  return (
    <>
      <TopAppBar variant="small" />
      <Content withPad>
        <Container withRadius>
          <Section title="Создание нового баг репорта" padding_top_size="lg">
            <Input
              labelText="Заголовок репорта"
              value={bugTitle}
              onChange={(e) => {
                setBugTitle(e.target.value)
              }}
            />
            <TextArea
              labelText="Описание проблемы"
              value={bugDesc}
              onChange={(e) => {
                setBugDesc(e.target.value)
              }}
            />
            <Input
              labelText="Почта"
              value={bugEmail}
              onChange={(e) => {
                setBugEmail(e.target.value)
              }}
            />
            <p className={style.label}>Укажите почту, если хотите получить обратную связь</p>
          </Section>
          <Section align_items="right" padding_bot_size="lg">
            <Section items_direction="row" withoutPad isFit>
              <Button
                variant="text"
                onClick={() => {
                  router.back()
                }}>
                Отмена
              </Button>
              <Button onClick={handleSend}>Отправить</Button>
            </Section>
          </Section>
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
