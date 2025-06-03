"use client"

import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import { $wish, handleSetWish, handleUpdateWish } from "@/context/wish"
import { IUpdateWish } from "@/types/wish"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditWishPage() {
  //Роутер
  const router = useRouter()

  // Контекст
  const [wish, updateWish] = useUnit([$wish, handleUpdateWish])

  // Переменные
  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [productLink, setProductLink] = useState<string>("")
  const [image, setImage] = useState<string>("")

  // Эффекты
  useEffect(() => {
    if (wish) {
      setName(wish.name || "")
      setPrice(wish.price?.toString() || "") // Конвертируем число в строку
      setProductLink(wish.productLink || "")
    }
  }, [wish])

  // Обработчики
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wish) return
    try {
      updateWish({
        id: wish.id,
        name,
        price: price ? Number(price) : wish.price ? 0 : undefined, // Конвертируем обратно в число
        productLink: productLink || undefined,
      } as IUpdateWish)
      router.back()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section align_items="center">
          <Section withoutPad isFit>
            <Monogram
              monogram_type={wish?.image ? "image" : "icon"}
              icon="featured_seasonal_and_gifts"
              size="md"
              url={image ? image : process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + wish?.image}
            />
          </Section>
        </Section>
        <Section padding_top_size="lg">
          <Input labelText="Ссылка на изображение" value={image} onChange={(e) => setImage(e.target.value)} />
          <Input labelText="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <Input labelText="Цена" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} trailingIcon="currency_ruble" />
          <Input labelText="Ссылка на товар" value={productLink} onChange={(e) => setProductLink(e.target.value)} />
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
