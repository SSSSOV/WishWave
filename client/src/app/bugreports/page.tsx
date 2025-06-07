"use client"

import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $bugreports, handleFetchBugreports } from "@/context/bugreports"
import { usePageTitle } from "@/hooks/usePageTitle"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"

export default function BugreportsPage() {
  usePageTitle("Багрепорты")
  const router = useRouter()

  const [bugreports, fetchBugrports] = useUnit([$bugreports, handleFetchBugreports])

  useEffect(() => {
    fetchBugrports()
  }, [])

  return (
    <>
      <ThemeToggle isAbsolute />
      <TopAppBar variant="small" />
      <Content>
        <Container withRadius withoutBg>
          <Section title="Ваши баг репорты" padding_top_size="lg">
            <List withoutPad>
              {bugreports && bugreports.length > 0 ? (
                bugreports.map((report) => (
                  <ListItem
                    key={report.id}
                    condition={2}
                    headline={report.title}
                    overline={new Date(report.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    trailing_type="icon"
                  />
                ))
              ) : (
                <ListItem condition={2} headline="пусто" />
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
