"use client"

import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $stats, handleFetchStats } from "@/context/bugreports"
import { usePageTitle } from "@/hooks/usePageTitle"
import { useUnit } from "effector-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"

export default function DashboardPage() {
  usePageTitle("Панель администратора")
  const router = useRouter()

  const [stats, fetchStats] = useUnit([$stats, handleFetchStats])

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <>
      <ThemeToggle isAbsolute></ThemeToggle>
      <TopAppBar />
      <Content topBarSize="sm" bgColor="none">
        <Container withoutBg>
          <Section title="Проблемы" padding_top_size="lg">
            <p>Здесь вы можете отследить проблемы работы приложения, а так же возможно опасный контент.</p>
            <List withoutPad>
              <ListItem
                condition={2}
                leading="bug_report"
                leading_type="icon"
                leading_color="error"
                headline={stats?.bugReports ? `Репортов: ${stats?.bugReports}` : "Репортов нет"}
                overline="багрепорты"
                trailing_type="icon"
                onClick={() => {
                  router.push("/admin/bugs")
                }}
              />
              <ListItem
                condition={2}
                leading="report"
                leading_type="icon"
                leading_color="error"
                headline="Пока не доступно"
                overline="жалобы на контент"
                // trailing_type="icon"
                // onClick={() => {
                //   router.push("/admin/reports")
                // }}
              />
            </List>
          </Section>
          <Section>
            <hr />
          </Section>
          <Section title="Поиск контента" padding_bot_size="md" padding_top_size="sm">
            <p>Здесь вы можете найти интересующий вас контент, используя ID, а также управлять им.</p>
            <List withoutPad>
              <ListItem
                condition={2}
                leading="featured_seasonal_and_gifts"
                leading_type="icon"
                leading_color="primary"
                headline={stats?.wishes ? `Желаний: ${stats?.wishes}` : "Желаний нет"}
                overline="желания"
                trailing_type="icon"
                trailing="search"
                onClick={() => {
                  router.push("/admin/wishes")
                }}
              />
              <ListItem
                condition={2}
                leading="list"
                leading_type="icon"
                leading_color="secondary"
                headline={stats?.wishLists ? `Списков: ${stats?.wishLists}` : "Списков нет"}
                overline="списки"
                trailing_type="icon"
                trailing="search"
                onClick={() => {
                  router.push("/admin/lists")
                }}
              />
              <ListItem
                condition={2}
                leading="account_circle"
                leading_type="icon"
                leading_color="tertiary"
                headline={stats?.users ? `Пользователей: ${stats?.users}` : "Пользователей нет"}
                overline="пользователи"
                trailing_type="icon"
                trailing="search"
                onClick={() => {
                  router.push("/admin/users")
                }}
              />
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
