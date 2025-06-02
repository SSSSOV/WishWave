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
      <Content bgColor="secondary" topBarSize="none" withPad>
        <Container withoutBg>
          <Section padding_bot_size="lg">
            <p className={styles.title}>
              «WishWave помогает легко создавать вишлисты, делиться ими с друзьями и получать именно то, что вы хотите. Больше никаких разочарований —
              только желанные подарки!»
            </p>
          </Section>
        </Container>
      </Content>
      <Content topBarSize="none" withPad>
        <Container padding_top="lg" withRadius withoutBg>
          <Section title="Преимущества сервиса" title_size="md" padding_top_size="lg" padding_bot_size="lg" align_items="center">
            <List withoutPad>
              <ListItem
                condition={3}
                leading="bookmark"
                leading_type="icon"
                leading_color="none"
                overline="Добавляйте желания за минуту"
                headline="Ссылки, фото, описания — все в одном месте."
              />
              <ListItem
                condition={3}
                leading="groups"
                leading_type="icon"
                leading_color="none"
                overline="Делитесь списками легко"
                headline="Отправьте ссылку или добавьте друзей."
              />
              <ListItem
                condition={3}
                leading="security"
                leading_type="icon"
                leading_color="none"
                overline="Контролируйте приватность"
                headline="Открытые, закрытые или частично доступные списки."
              />
              <ListItem
                condition={3}
                leading="local_fire_department"
                leading_type="icon"
                leading_color="none"
                overline="Лента рекомендаций"
                headline="Всегда вкурсе что сейчас в тренде."
              />
            </List>
          </Section>
          <Section title="Как это работает?" title_size="md" padding_top_size="lg" align_items="center">
            <List withoutPad>
              <ListItem
                condition={3}
                leading="looks_one"
                leading_type="icon"
                leading_color="none"
                overline="Создайте список"
                headline="добавьте товары, впечатления или идеи."
              />
              <ListItem
                condition={3}
                leading="looks_two"
                leading_type="icon"
                leading_color="none"
                overline="Настройте доступ"
                headline="выберите, кто увидит ваш вишлист."
              />
              <ListItem
                condition={3}
                leading="looks_3"
                leading_type="icon"
                leading_color="none"
                overline="Поделитесь с друзьями"
                headline="чтобы они могли увидеть ваши желания"
              />
              <ListItem
                condition={3}
                leading="looks_4"
                leading_type="icon"
                leading_color="none"
                overline="Получайте подарки"
                headline="без дублирования и неожиданностей!"
              />
            </List>
          </Section>
          <Section align_items="center" padding_top_size="lg">
            <p className={styles.title}>Присоединяйтесь сейчас и превратите процесс дарения в удовольствие!</p>
          </Section>
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
