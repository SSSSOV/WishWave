"use client"

import { useEffect } from "react"
import { useUnit } from "effector-react"
import { handleSetPageTitle, handleClearPageTitle } from "@/context/page"

export const usePageTitle = (title: string, additionalText = "") => {
  const setPageTitle = useUnit(handleSetPageTitle)

  useEffect(() => {
    // Устанавливаем заголовок страницы и хранилище одним эффектом
    const fullTitle = `WishWave | ${title}${additionalText ? ` - ${additionalText}` : ""}`
    document.title = fullTitle
    setPageTitle(title)

    return () => {
      // Очищаем при размонтировании (опционально)
      document.title = "WishWave"
      handleClearPageTitle()
    }
  }, [title, additionalText, setPageTitle])
}
