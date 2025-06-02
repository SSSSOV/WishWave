import Button from "@/components/ui/buttons/Button"
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Container from "@/components/ui/container/Container"
import Content from "@/components/ui/content/Content"
import Figure from "@/components/ui/figure/Figure"
import Section from "@/components/ui/section/Section"

export default function UnPage() {
  return (
    <>
      <Figure />
      <Figure variant={2} />

      <ThemeToggle isAbsolute />
      <Content isScreen withPad>
        <Container withRadius>
          <Section title="403. Отказано!" padding_top_size="lg" title_size="lg">
            <p>Вам было отказано в доступе к странице на которую вы пытались перейти.</p>
          </Section>
          <Section align_items="right" padding_top_size="lg" padding_bot_size="lg">
            <Button variant="filled" icon="home">
              на глвную
            </Button>
          </Section>
        </Container>
      </Content>
    </>
  )
}
