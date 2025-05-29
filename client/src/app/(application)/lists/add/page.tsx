"use client"

import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Section from "@/components/ui/section/Section"
import { handleCreateWishList } from "@/context/wish_lists"
import { usePageTitle } from "@/hooks/usePageTitle"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AddListPage() {
  usePageTitle("Создать список")
  // Роутер
  const router = useRouter()

  // Стор
  const [createWishList] = useUnit([handleCreateWishList])

  // Переменные
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [desc, setDisc] = useState("")
  const [access, setAccess] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      createWishList({ name: name, eventDate: date, description: desc, accesslevelId: access })
      router.back()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section title="Введите информацию о списке:" padding_top_size="lg">
          <Input
            labelText="Название"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <Input
            labelText="Дата события"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
            }}
            type="date"
          />

          <Input
            labelText="Описание"
            value={desc}
            onChange={(e) => {
              setDisc(e.target.value)
            }}
          />
          <Section title="Уровеь доступа" withoutPad>
            <Section items_direction="row" withoutPad>
              <input
                type="radio"
                id="public"
                name="AccessLevel"
                value="1"
                onChange={(e) => {
                  setAccess(Number(e.target.value))
                }}
                checked={access === 1}
              />
              <label htmlFor="public">Публичный</label>
            </Section>
            <Section items_direction="row" withoutPad>
              <input
                type="radio"
                id="private"
                name="AccessLevel"
                value="2"
                onChange={(e) => {
                  setAccess(Number(e.target.value))
                }}
                checked={access === 2}
              />
              <label htmlFor="private">Приватный</label>
            </Section>
            <Section items_direction="row" withoutPad>
              <input
                type="radio"
                id="link"
                name="AccessLevel"
                value="3"
                onChange={(e) => {
                  setAccess(Number(e.target.value))
                }}
                checked={access === 3}
              />
              <label htmlFor="link">По ссылке</label>
            </Section>
            <Section items_direction="row" withoutPad>
              <input
                type="radio"
                id="friends"
                name="AccessLevel"
                value="4"
                onChange={(e) => {
                  setAccess(Number(e.target.value))
                }}
                checked={access === 4}
              />
              <label htmlFor="friends">Для друзей</label>
            </Section>
          </Section>
        </Section>
        <Section align_items="right" padding_bot_size="lg">
          <Section items_direction="row" isFit withoutPad>
            <Button
              variant="text"
              type="reset"
              onClick={() => {
                router.back()
              }}>
              Отмена
            </Button>
            <Button variant="filled" type="submit">
              Создать
            </Button>
          </Section>
        </Section>
        <Section title="Приватность">
          {access == 1 ? (
            <p>Этот список будет виден всем пользователям в сервсие.</p>
          ) : access == 2 ? (
            <p>Никто не сможет увидеть этот список, кроме вас.</p>
          ) : access == 3 ? (
            <p>Этот список будет виден пользователям, которые открыли его через ссылку.</p>
          ) : access == 4 ? (
            <p>Этот список будет виден пользователям, которые есть у вас в друзьях.</p>
          ) : (
            ""
          )}
        </Section>
      </form>
    </>
  )
}
