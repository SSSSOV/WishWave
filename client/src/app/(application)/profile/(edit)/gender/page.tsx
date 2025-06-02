"use client"

import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Section from "@/components/ui/section/Section"
import { $isAuth, $user, handleUpdateInfo } from "@/context/user"
import { usePageTitle } from "@/hooks/usePageTitle"
import { gender } from "@/types/user"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import style from "@/app/home.module.css"

export default function GenderPage() {
  usePageTitle("Пол")

  //Роутер
  const router = useRouter()

  // Контекст
  const [isAuth, user, handle] = useUnit([$isAuth, $user, handleUpdateInfo])

  // Переменные
  const [gender, setGender] = useState("")

  if (!user) return <NonAuthPage />

  // Эффекты
  useEffect(() => {
    setGender(user.gender ? user.gender : "")
  }, [])

  // Обработчики
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      handle({ gender: gender as gender })
      router.back()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <Section padding_top_size="lg">
        <Section items_direction="row" withoutPad>
          <input
            type="radio"
            id="public"
            name="AccessLevel"
            value="female"
            onChange={(e) => {
              setGender(e.target.value)
            }}
            checked={gender === "female"}
          />
          <label htmlFor="public">Женский</label>
        </Section>
        <Section items_direction="row" withoutPad>
          <input
            type="radio"
            id="private"
            name="AccessLevel"
            value="male"
            onChange={(e) => {
              setGender(e.target.value)
            }}
            checked={gender === "male"}
          />
          <label htmlFor="private">Мужской</label>
        </Section>
      </Section>
      <Section title="Кто может видеть ваш пол" padding_top_size="lg">
        <p>Эту информацию никто не будет видеть, она необходима только для технологии рекомендаций WishWave. Подробнее…</p>
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
  )
}
