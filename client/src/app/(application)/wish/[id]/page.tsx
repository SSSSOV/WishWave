"use client"

import Button from "@/components/ui/buttons/Button"
import List from "@/components/ui/list/List"
import ListItem, { icon_color } from "@/components/ui/list/ListItem"
import Loader from "@/components/ui/loader/Loader"
import Monogram from "@/components/ui/monogram/Monogram"
import Section from "@/components/ui/section/Section"
import { $wish, handleDeleteWish, handleFetchWish } from "@/context/wish"
import { IWish } from "@/types/wish"
import { useUnit } from "effector-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function WishPage() {
  // Роутер
  const router = useRouter()

  // Переменные
  const { id, shareToken } = useParams() // Получаем ID из URL

  // Стор
  const [wish, fetchWish, deleteWish] = useUnit([$wish, handleFetchWish, handleDeleteWish])

  // Эффекты

  useEffect(() => {
    fetchWish({ id: Number(id), shareToken: String(shareToken) })
  }, [])

  // Обработчики

  const handleOpenProduct = (url: string) => {
    window.open(url, "_blank")?.focus()
  }

  const handleEdit = () => {
    router.push(`/wish/${wish.id}/edit`)
  }

  const handleDelete = () => {
    deleteWish(wish.id)
    router.back()
  }

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Успешно скопировано!")
    } catch (err) {
      toast.error("Не удалось скопировать: " + err)
    }
  }

  const colors = ["primary", "secondary", "tertiary"]

  if (!wish || wish.id != Number(id)) {
    return <Loader></Loader>
  }

  return (
    <>
      <Section align_items="center" padding_top_size="md">
        <Section withoutPad isFit>
          <Monogram
            monogram_type={wish.image ? "image" : "icon"}
            icon="featured_seasonal_and_gifts"
            size="lg"
            url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + wish.image}
            color={colors[wish.id % 3] as icon_color}
          />
        </Section>
      </Section>
      <Section>
        <List withoutPad>
          <ListItem
            condition={2}
            headline={wish.name}
            onClick={() => {
              handleCopyToClipboard(wish.name)
            }}
            trailing_type="icon"
            trailing_color="primary"
            trailing="content_copy"
            overline="название"
          />
          <ListItem condition={2} headline={String(wish.price) + " руб."} overline="цена" />
          {wish.productLink ? (
            <ListItem
              condition={2}
              headline={wish.productLink ? wish.productLink : "Не указано"}
              overline="ссылка"
              trailing_type="icon"
              trailing_color="primary"
              trailing="open_in_new"
              onClick={() => handleOpenProduct(wish.productLink ? wish.productLink : "")}
            />
          ) : (
            <ListItem condition={2} headline={wish.productLink ? wish.productLink : "Не указано"} overline="ссылка" />
          )}
          <ListItem
            condition={2}
            headline={"Нажмите, чтобы забронировать"}
            overline="бронирование"
            trailing_type="icon"
            trailing="radio_button_unchecked"
          />
        </List>
      </Section>
      {/* <Section align_items="right">
        <Section items_direction="row" withoutPad isFit>
          <Button variant="text" icon="edit" onClick={handleEdit}>
            желание
          </Button>
          <Button variant="text" icon="delete" color="error" onClick={handleDelete}>
            желание
          </Button>
        </Section>
      </Section> */}
    </>
  )
}
