"use client"

import Content from "@/components/ui/content/Content"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function ReportsPage() {
  usePageTitle("Жалобы на контент")

  return (
    <>
      <TopAppBar />
      <Content></Content>
    </>
  )
}
