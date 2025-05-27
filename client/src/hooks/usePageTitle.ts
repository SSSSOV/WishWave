"use client"

import { useEffect } from "react"
import { useUnit } from "effector-react"
import { $pageTitle, handleClearPageTitle, handleSetPageTitle } from "@/context/page"

export const usePageTitle = (title: string, additionalText = "") => {
  const [pageTitle, setPageTitle] = useUnit([$pageTitle, handleSetPageTitle])

  useEffect(() => {
    setPageTitle(title)
  }, [title, setPageTitle])

  useEffect(() => {
    document.title = `WishWave | ${title}${additionalText ? ` - ${additionalText}` : ``}`
  }, [title, additionalText])
}
