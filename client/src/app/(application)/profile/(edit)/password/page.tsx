"use client"

import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Section from "@/components/ui/section/Section"
import { handleSetPageTitle } from "@/context/page"
import { handleUpdatePassword } from "@/context/user"
import { usePageTitle } from "@/hooks/usePageTitle"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function PasswordPage() {
  usePageTitle("Пароль")

  const router = useRouter()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const [updatePassword] = useUnit([handleUpdatePassword])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (newPassword == repeatPassword) {
        updatePassword({ oldPassword, newPassword })
        router.back()
      } else toast.error("Пароли не свопадают!")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form action="" onSubmit={handleUpdate}>
        <Section padding_top_size="lg">
          <Input
            labelText="Старый пароль"
            type="password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value)
            }}
            required></Input>
          <Input
            labelText="Новый пароль"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
            }}
            minLength={5}
            maxLength={20}
            required></Input>
          <Input
            labelText="Повторите новый пароль"
            type="password"
            value={repeatPassword}
            onChange={(e) => {
              setRepeatPassword(e.target.value)
            }}
            minLength={5}
            maxLength={20}
            required></Input>
        </Section>
        <Section padding_top_size="lg" padding_bot_size="lg" align_items="right">
          <Section items_direction="row" isFit withoutPad>
            <Button variant="text" type="reset">
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
