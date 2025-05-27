"use client"

import { handleSetPageTitle } from "@/context/page"
import { useUnit } from "effector-react"
import { useEffect } from "react"

export default function PasswordPage() {
  // Заголовок страницы
  const [setPageTitle] = useUnit([handleSetPageTitle])

  useEffect(() => {
    setPageTitle("Пароль")
  }, [])

  return <></>
}
