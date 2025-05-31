"use client"

import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { usePageTitle } from "@/hooks/usePageTitle"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  usePageTitle("Панель администратора")
  const router = useRouter()

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
                headline="Репортов нет"
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
                headline="Жалоб нет"
                overline="жалобы на контент"
                trailing_type="icon"
                onClick={() => {
                  router.push("/admin/reports")
                }}
              />
            </List>
          </Section>
          <Section>
            <hr />
          </Section>
          <Section title="Поиск контента" padding_bot_size="md" padding_top_size="sm">
            <p>Здесь вы можете найти интересующий вас контент, используя название объекта или ID, а также управлять им.</p>
            <List withoutPad>
              <ListItem
                condition={2}
                leading="featured_seasonal_and_gifts"
                leading_type="icon"
                leading_color="primary"
                headline="0 желаний"
                overline="желания"
                trailing_type="icon"
                onClick={() => {
                  router.push("/admin/wishes")
                }}
              />
              <ListItem
                condition={2}
                leading="list"
                leading_type="icon"
                leading_color="secondary"
                headline="0 списков"
                overline="списки"
                trailing_type="icon"
                onClick={() => {
                  router.push("/admin/lists")
                }}
              />
              <ListItem
                condition={2}
                leading="account_circle"
                leading_type="icon"
                leading_color="tertiary"
                headline="0 пользователей"
                overline="пользователи"
                trailing_type="icon"
                onClick={() => {
                  router.push("/admin/users")
                }}
              />
            </List>
          </Section>
        </Container>
      </Content>
    </>
  )
}
