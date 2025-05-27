"use client"

import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import { handleSetPageTitle } from "@/context/page"
import { $isAuth, $user, handleUpdateInfo } from "@/context/user"
import { getInitials } from "@/lib/utils/getInitials"
import { hasNameContent } from "@/lib/utils/hasNameContent"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ImagePage() {
  //Роутер
  const router = useRouter()

  // Заголовок страницы
  const [setPageTitle] = useUnit([handleSetPageTitle])

  useEffect(() => {
    setPageTitle("Фото")
  }, [])

  // Контекст
  const [user, isAuth, handle] = useUnit([$user, $isAuth, handleUpdateInfo])

  if (!user) return <NonAuthPage />

  // Переменные
  const [image, setImage] = useState("")

  // Эффекты
  useEffect(() => {}, [user])

  // Обработчики
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      handle({ image })
      router.back()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section padding_top_size="lg" align_items="center" title={image ? "Новое фото" : "Ваше текущее фото"} title_size="xs">
          <Monogram
            monogram_type={user.image ? "image" : hasNameContent(user.fullname) ? "monogram" : "icon"}
            letter={hasNameContent(user.fullname) ? getInitials(user.fullname) : "person"}
            icon="person"
            size="lg"
            url={image ? image : process.env.NEXT_PUBLIC_SERVER_URL + "static/" + user.image}></Monogram>
        </Section>
        <Section padding_top_size="lg" title="Вставьте ссылку на новое изображение:">
          <Input labelText="Ссылка" value={image} onChange={(e) => setImage(e.target.value)} type="url" />
        </Section>
        {/* <Section title="Кто может видеть ваше имя" padding_top_size="lg">
          <p>
            Эту информацию смогут увидеть любые пользователи, которые будут общаться с вами или просматривать созданный вами контент в сервисе
            WishWave. Подробнее…
          </p>
        </Section> */}
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
