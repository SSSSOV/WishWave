"use client"

import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import Input from "@/components/ui/inputs/Input"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Section from "@/components/ui/section/Section"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { $bugreports, handleDeleteBugreport, handleFetchBugreports } from "@/context/bugreports"
import { usePageTitle } from "@/hooks/usePageTitle"
import { IBugreport } from "@/types/bugreport"
import { useUnit } from "effector-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import style from "@/app/home.module.css"
import Button from "@/components/ui/buttons/Button"
import Loader from "@/components/ui/loader/Loader"
import { Toaster } from "react-hot-toast"

export default function BugreportPage() {
  const router = useRouter()

  const { id } = useParams() // Получаем ID из URL
  const [bugreports, fetchBugreports, deleteBugreport] = useUnit([$bugreports, handleFetchBugreports, handleDeleteBugreport])
  const [shownReport, setShownReport] = useState<IBugreport | undefined>(undefined)
  usePageTitle(shownReport ? `Багрепорт #${shownReport.id}` : "Багрепорт")

  useEffect(() => {
    fetchBugreports()
  }, [])

  useEffect(() => {
    if (id && bugreports) setShownReport(bugreports.find((report) => report.id == Number(id)))
  }, [bugreports, id])

  return (
    <>
      <TopAppBar />
      <Content topBarSize="sm" bgColor="none">
        <Container withoutBg>
          <Section padding_top_size="lg">
            {shownReport ? (
              <>
                <Section title="Информация" withoutPad>
                  <List withoutPad>
                    <ListItem
                      condition={2}
                      headline={new Date(shownReport.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      overline="дата"
                    />
                    {shownReport.email && <ListItem condition={2} headline={shownReport.email} overline="почта" />}
                    {shownReport.owner && (
                      <ListItem
                        condition={2}
                        headline={shownReport.owner.login}
                        overline={`пользователь #${shownReport.owner.id}`}
                        leading="person"
                        url={process.env.NEXT_PUBLIC_SERVER_URL + "/static/" + shownReport.owner.image}
                        leading_type={shownReport.owner.image ? "image" : "icon"}
                      />
                    )}
                  </List>
                  <Section align_items="right" withoutPad>
                    <Button
                      variant="text"
                      color="error"
                      icon="delete"
                      onClick={() => {
                        deleteBugreport(shownReport.id)
                        router.back()
                      }}>
                      Удалить репорт
                    </Button>
                  </Section>
                </Section>
                <hr />

                <Section withoutPad title="заголовок" title_size="xs">
                  <p className={style.title}>{shownReport.title}</p>
                </Section>
                <hr />
                <Section withoutPad title="описание" title_size="xs">
                  <span className={style.body}>{shownReport.description ? shownReport.description : "Без описания"}</span>
                </Section>
              </>
            ) : (
              <Loader></Loader>
            )}
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
