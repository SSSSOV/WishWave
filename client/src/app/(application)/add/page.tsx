"use client"
import { Suspense } from "react"
import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import { $isAuth } from "@/context/user"
import { $wish, handleCreateWish } from "@/context/wish"
import { $wishLists, handleFetchWishLists } from "@/context/wish_lists"
import { usePageTitle } from "@/hooks/usePageTitle"
import { customStyles, OptionType } from "@/types/select"
import { useUnit } from "effector-react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ReactSelect from "react-select"

function AddPageContent() {
  // Роутер
  const router = useRouter()

  // Параметры
  const params = useSearchParams() // Получаем ID из URL
  const listId = params.get("listId") // Получаем listId из URL

  // Состояния
  const [image, setImage] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState<string>("")
  const [link, setLink] = useState("")
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)
  const [options, setOptions] = useState<OptionType[]>([])

  // Стор
  const [isAuth, wishLists, createWish, fetchWishLists] = useUnit([$isAuth, $wishLists, handleCreateWish, handleFetchWishLists])

  // Обработчики
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!selectedOption) {
        toast("Пожалуйста, выберите список", {
          icon: "⚠️",
        })
        return
      }
      if (selectedOption.value == 0) {
        toast("Сначала создайте список", {
          icon: "⚠️",
        })
        router.push("lists/add")
        return
      }

      if (!name) {
        toast("Пожалуйста, введите название", {
          icon: "⚠️",
        })
        return
      }

      createWish({ listId: selectedOption?.value, name: name, price: price ? Number(price) : undefined, productLink: link, image: image })
      router.back()
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()
    router.back()
  }

  // Еффекты
  useEffect(() => {
    if (isAuth) fetchWishLists(null)
  }, [])

  useEffect(() => {
    if (wishLists && wishLists.length > 0) {
      setOptions(wishLists.map((list) => ({ value: list.id, label: list.name })))
    } else {
      setOptions([{ value: 0, label: "У вас нет списков!" }]) // Массив с одним элементом
    }
  }, [wishLists])

  useEffect(() => {
    if (listId && options) {
      setSelectedOption(options.find((option) => option.value == Number(listId)) as OptionType)
    }
  }, [listId, options])

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section align_items="center" padding_top_size="lg">
          <Monogram letter="ww" size="full" isRounded monogram_type={image ? "image" : "icon"} icon="image" color="primary" url={image}></Monogram>
        </Section>
        <Section title="" padding_bot_size="xs" items_direction="row" align_items="right">
          <Input
            labelText="Ссылка на изображение"
            isFull
            value={image}
            onChange={(e) => {
              setImage(e.target.value)
            }}
          />
        </Section>
        <Section title="" padding_top_size="xs">
          <Input
            labelText="Название"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <Input labelText="Цена" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} trailingIcon="currency_ruble" />
          <Input
            labelText="Ссылка на маркетплейс"
            value={link}
            onChange={(e) => {
              setLink(e.target.value)
            }}
          />
          {isAuth ? (
            <ReactSelect
              styles={customStyles}
              instanceId="fixed-select"
              value={selectedOption}
              onChange={(newValue) => setSelectedOption(newValue)}
              options={options}
              isMulti={false}
              placeholder="Выберите список"
            />
          ) : (
            ""
          )}
        </Section>
        <Section align_items="right" padding_bot_size="lg">
          <Section items_direction="row" isFit withoutPad>
            <Button variant="text" onClick={handleCancel}>
              Отмена
            </Button>
            <Button variant="filled" type="submit">
              Добавить
            </Button>
          </Section>
        </Section>
      </form>
    </>
  )
}

export default function AddPage() {
  usePageTitle("Добавить желание")

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <AddPageContent />
    </Suspense>
  )
}
