"use client"
import Button from "@/components/ui/buttons/Button"
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle"
import Input from "@/components/ui/inputs/Input"
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import styles from "@/app/home.module.css"
import { useRouter } from "next/navigation"
import Figure from "@/components/ui/figure/Figure"
import Content from "@/components/ui/content/Content"
import Section from "@/components/ui/section/Section"
import Container from "@/components/ui/container/Container"
import List from "@/components/ui/list/List"
import ListItem from "@/components/ui/list/ListItem"
import Footer from "@/components/shared/footer/footer"

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Figure />
      <Figure variant={2} />
      <ThemeToggle isAbsolute></ThemeToggle>
      <Content isScreen withPad>
        <Container withoutBg>
          <Section withoutPad>
            <p className={styles.headline}>
              Приветствуем вас на <ins>WishWave</ins> — вашем месте для создания и обмена вишлистами!
            </p>
            <p className={styles.title}>
              Поделитесь своими желаниями с друзьями и получайте только <i>самые желанные подарки</i>.{" "}
            </p>
            <Section align_items="right" withoutPad>
              <Section items_direction="row" isFit withoutPad>
                <Button
                  variant="text"
                  icon="login"
                  onClick={() => {
                    router.push("/login")
                  }}>
                  Вход
                </Button>
                <Button
                  variant="filled"
                  icon="person_add"
                  onClick={() => {
                    router.push("/signup")
                  }}>
                  Регистрация
                </Button>
              </Section>
            </Section>
          </Section>
        </Container>
      </Content>
      <Content bgColor="secondary" topBarSize="none">
        <Container withPad withoutBg>
          <Section withoutPad>
            <List withoutPad>
              <ListItem condition={3} headline="🔹 Создавайте вишлисты на любой случай: дни рождения, свадьбы, Новый год или просто потому что." />
              <ListItem condition={3} headline="🔹 Делитесь списками с друзьями и близкими — пусть они точно знают, что вам понравится." />
              <ListItem condition={3} headline="🔹 Отмечайте подарки, чтобы избежать повторов и неожиданных сюрпризов." />
              <ListItem condition={3} headline="🔹 Открывайте для себя желания других и вдохновляйтесь!" />
            </List>
          </Section>
        </Container>
      </Content>
      <Content bgColor="tertiary" topBarSize="none">
        <Container withoutBg>
          <Section title="✨ Почему WishWave?" title_size="lg" padding_top_size="lg" padding_bot_size="lg">
            <List withoutPad>
              <ListItem condition={1} headline="✅ Простота и удобство — добавляйте желания в пару кликов." />
              <ListItem condition={1} headline="✅ Гибкие настройки приватности — открытый список или только для избранных." />
              <ListItem condition={1} headline="✅ Уведомления и напоминания — никогда не пропустите важные даты." />
            </List>
          </Section>

          <p className={styles.headline}>Присоединяйтесь сейчас и превратите процесс дарения в удовольствие!</p>
        </Container>
      </Content>
      <Content topBarSize="none">
        <Container withoutBg>
          <Footer></Footer>
        </Container>
      </Content>
    </>
  )
}
