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
import { usePageTitle } from "@/hooks/usePageTitle"

export default function BirthdayPage() {
  usePageTitle("Дата рождения")

  //Роутер
  const router = useRouter()

  // Заголовок страницы
  useEffect(() => {}, [])

  // Контекст
  const [isAuth, user, handle] = useUnit([$isAuth, $user, handleUpdateInfo])

  if (!user) return <NonAuthPage />

  // Переменные
  const [birthday, setBirthday] = useState("")

  // Эффекты
  useEffect(() => {
    setBirthday(user.birthday ? user.birthday : "")
  }, [])

  // Обработчики
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      handle({ birthday })
      router.back()
    } catch (error) {
      console.log(error)
    }
  }

  if (!user) return <NonAuthPage />

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section padding_top_size="lg">
          <Input labelText="Дата рождения" value={birthday} onChange={(e) => setBirthday(e.target.value)} type="date" />
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
