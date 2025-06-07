"use client"

import Button from "@/components/ui/buttons/Button"
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import Figure from "@/components/ui/figure/Figure"
import Section from "@/components/ui/section/Section"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"

export default function NotFound() {
  const router = useRouter()

  return (
    <>
      <Figure />
      <Figure variant={2} />

      <ThemeToggle isAbsolute />
      <Content isScreen withPad>
        <Container withRadius>
          <Section title="404. Не найдено..." padding_top_size="lg" title_size="lg">
            <p>Не удалось найти страницу на которую вы пытались перейти.</p>
          </Section>
          <Section align_items="right" padding_top_size="lg" padding_bot_size="lg">
            <Button variant="filled" icon="home" onClick={() => router.replace("/main")}>
              на глвную
            </Button>
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
