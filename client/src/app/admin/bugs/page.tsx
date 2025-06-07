"use client"

import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $bugreports, handleFetchBugreports } from "@/context/bugreports"
import { usePageTitle } from "@/hooks/usePageTitle"
import { IBugreport } from "@/types/bugreport"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

export default function BugsPage() {
  usePageTitle("Багрепорты")

  const router = useRouter()

  const [bugreports, fetchBugreports] = useUnit([$bugreports, handleFetchBugreports])
  const [shownReport, setShownReports] = useState<IBugreport[] | null>(null)

  useEffect(() => {
    fetchBugreports()
  }, [])

  useEffect(() => {
    if (bugreports) setShownReports(bugreports)
  }, [bugreports])

  return (
    <>
      <TopAppBar />
      <Content topBarSize="sm" bgColor="none">
        <Container withoutBg>
          <Section padding_top_size="lg">
            <Input leadingIcon="search" />
          </Section>
          <Section title="Все репорты">
            <List withoutPad>
              {shownReport && shownReport?.length > 0 ? (
                shownReport.map((report) => (
                  <ListItem
                    key={report.id}
                    condition={2}
                    headline={report.title}
                    overline={`ID${report.id} - ${new Date(report.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}`}
                    trailing_type="icon"
                    onClick={() => {
                      router.push(`/admin/bugs/${report.id}`)
                    }}
                  />
                ))
              ) : (
                <ListItem condition={1} headline="Пусто" />
              )}
            </List>
          </Section>
        </Container>
      </Content>
      <Toaster
        position="bottom-center"
        toastOptions={{
          // Define default options
          icon: null,
          className: "toast",
          duration: 2000,
          removeDelay: 1000,
        }}
      />
    </>
  )
}
