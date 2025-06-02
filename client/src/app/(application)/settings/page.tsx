"use client"

import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Section from "@/components/ui/section/Section"
import styles from "@/app/home.module.css"
import Button from "@/components/ui/buttons/Button"
import Footer from "@/components/shared/footer/footer"
import { useUnit } from "effector-react"
import { $pageTitle, handleSetPageTitle } from "@/context/page"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const setPageTitle = useUnit(handleSetPageTitle)
  const router = useRouter()

  useEffect(() => {
    setPageTitle("Настройки")
    return () => {
      setPageTitle("")
    }
  }, [])

  return (
    <>
      <Section items_direction="row" padding_top_size="lg">
        <ThemeToggle></ThemeToggle>
        <Button
          icon="bug_report"
          onClick={() => {
            router.push("/bugreports/add")
          }}></Button>
      </Section>
      <Footer></Footer>
    </>
  )
}
