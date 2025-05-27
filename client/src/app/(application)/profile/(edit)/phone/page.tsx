"use client"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Section from "@/components/ui/section/Section"
import { $isAuth, $user, handleUpdateInfo } from "@/context/user"
import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import { handleSetPageTitle } from "@/context/page"

export default function PhonePage() {
  //Роутер
  const router = useRouter()

  // Заголовок страницы
  const [setPageTitle] = useUnit([handleSetPageTitle])

  useEffect(() => {
    setPageTitle("Номер телефона")
  }, [])

  // Контекст
  const [isAuth, user, handle] = useUnit([$isAuth, $user, handleUpdateInfo])

  if (!user) return <NonAuthPage />

  // Переменные
  const [phone, setPhone] = useState("")

  // Эффекты
  useEffect(() => {
    setPhone(user.phone ? user.phone : "")
  }, [])

  // Обработчики
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      handle({ phone })
      router.back()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section padding_top_size="lg">
          <Input labelText="Номер телефона" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
        </Section>
        <Section title="Кто может видеть ваше имя" padding_top_size="lg">
          <p>
            Эту информацию смогут увидеть любые пользователи, которые будут общаться с вами или просматривать созданный вами контент в сервисе
            WishWave. Подробнее…
          </p>
        </Section>
        <Section padding_top_size="lg" padding_bot_size="lg">
          <div className="flex justify-end">
            <Button
              variant="text"
              type="reset"
              onClick={() => {
                router.back()
              }}>
              Отмена
            </Button>
            <Button variant="filled" type="submit">
              Сохранить
            </Button>
          </div>
        </Section>
      </form>
    </>
  )
}
