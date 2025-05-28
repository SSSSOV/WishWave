"use client"

import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Section from "@/components/ui/section/Section"
import { handleSetPageTitle } from "@/context/page"
import { usePageTitle } from "@/hooks/usePageTitle"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PasswordPage() {
  usePageTitle("Пароль")

  const router = useRouter()

  return (
    <>
      <form action="">
        <Section padding_top_size="lg">
          <Input labelText="Старый пароль" type="password"></Input>
          <Input labelText="Новый пароль" type="password"></Input>
          <Input labelText="Повторите новый пароль" type="password"></Input>
        </Section>
        <Section padding_top_size="lg" padding_bot_size="lg" align_items="right">
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
              Сохранить
            </Button>
          </Section>
        </Section>
      </form>
    </>
  )
}
