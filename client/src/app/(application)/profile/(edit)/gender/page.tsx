"use client"

import NonAuthPage from "@/components/shared/nonAuthPage/NonAuthPage"
import { handleSetPageTitle } from "@/context/page"
import { $isAuth, $user, handleUpdateInfo } from "@/context/user"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function GenderPage() {
  //Роутер
  const router = useRouter()

  // Заголовок страницы
  const [setPageTitle] = useUnit([handleSetPageTitle])

  useEffect(() => {
    setPageTitle("Пол")
  }, [])

  // Контекст
  const [isAuth, user, handle] = useUnit([$isAuth, $user, handleUpdateInfo])

  if (!user) return <NonAuthPage />
  return
}
