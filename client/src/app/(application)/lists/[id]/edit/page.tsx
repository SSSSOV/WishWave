"use client"

import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Section from "@/components/ui/section/Section"
import { $wishList, handleUpdateWishList, handleSetWishList } from "@/context/wish_lists"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditWishListPage() {
  //Роутер
  const router = useRouter()

  // Контекст
  const [wishList, updateWishList, setWishList] = useUnit([$wishList, handleUpdateWishList, handleSetWishList])

  // Переменные
  const [name, setName] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [access, setAccess] = useState<number>(0)

  // Эффекты
  useEffect(() => {
    if (wishList) {
      setName(wishList.name ? wishList.name : "")
      setDate(wishList.eventDate ? wishList.eventDate : "")
      setDescription(wishList.description ? wishList.description : "")
      setAccess(wishList.accessLevelId ? wishList.accessLevelId : 0)
    }
  }, [wishList])

  // Обработчики
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (wishList) {
      try {
        updateWishList({ id: wishList.id, name: name, accesslevelId: access, description: description, eventDate: date })
        router.back()
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section padding_top_size="lg">
          <Input labelText="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <Input labelText="Дата" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input labelText="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
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
