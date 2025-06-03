"use client"
import Content from "@/components/ui/content/Content"
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar"
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar"
import { usePathname, useRouter } from "next/navigation"
import styles from "@/app/home.module.css"
import { StrictMode, useEffect, useState } from "react"
import NavigationRail from "@/components/ui/navigation_rail/NavigationRail"
import Section from "@/components/ui/section/Section"
import Container from "@/components/ui/container/Container"
import { useUnit } from "effector-react"
import { $isAuth, $user, handleCheckAuth, handleFetchUser } from "@/context/user"
import { $pageTitle } from "@/context/page"

export type PageConfig = {
  title: string
  label?: string
  path: string
  icon?: string
  isNav?: boolean
}
export type NavItemConfig = {
  label: string
  icon: string
  action: () => void
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Роутер
  const router = useRouter()

  // Контекст
  const [isAuth, checkAuth] = useUnit([$isAuth, handleCheckAuth])

  // Переменные
  const [isMobile, setIsMobile] = useState(false)

  // Эффекты
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // Брекпоинт, например, 768px
    }

    checkIfMobile() // Проверяем при загрузке
    window.addEventListener("resize", checkIfMobile) // И при изменении размера

    if (!isAuth) checkAuth()
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const PAGES: PageConfig[] = [
    {
      title: "Главная",
      label: "Главная",
      path: "/main",
      icon: "home",
      isNav: true,
    },
    {
      title: "Ваши друзья",
      label: "Друзья",
      path: "/friends",
      icon: "group",
      isNav: true,
    },
    // {
    //   title: "Создать",
    //   label: "Создать",
    //   path: "/add",
    //   icon: "add",
    //   isNav: true,
    // },
    {
      title: "Ваши списки",
      label: "Списки",
      path: "/lists",
      icon: "bookmark",
      isNav: true,
    },
    {
      title: "Ваш профиль",
      label: "Профиль",
      path: "/profile",
      icon: "account_circle",
      isNav: true,
    },
    {
      title: "Настройки",
      label: "Настройки",
      path: "/settings",
      icon: "account_circle",
      isNav: false,
    },
    {
      title: "Фото профиля",
      path: "/profile/image",
    },
    {
      title: "Имя",
      path: "/profile/name",
    },
    {
      title: "Дата рождения",
      path: "/profile/birthday",
    },
    {
      title: "Пол",
      path: "/profile/gender",
    },
    {
      title: "Логин",
      path: "/profile/login",
    },
    {
      title: "Пароль",
      path: "/profile/password",
    },
    {
      title: "Почта",
      path: "/profile/email",
    },
  ]

  const NAVS: NavItemConfig[] = [
    {
      label: "Главная",
      icon: "home",
      action: () => {
        router.push("/main")
      },
    },
    {
      label: "Друзья",
      icon: "group",
      action: () => {
        router.push("/friends")
      },
    },
    // {
    //   label: "Создать",
    //   icon: "add",
    //   action: () => {
    //     router.push("/add")
    //   },
    // },
    {
      label: "Списки",
      icon: "bookmark",
      action: () => {
        router.push("/lists")
      },
    },
    {
      label: "Профиль",
      icon: "account_circle",
      action: () => {
        router.push("/profile")
      },
    },
  ]

  return (
    <>
      {isMobile ? (
        <>
          <TopAppBar variant="small" />
          <Content navigationType="bar" topBarSize="sm">
            <Container withoutBg>{children}</Container>
          </Content>
          <NavigationBar
            pages={PAGES}
            FAB
            FAB_icon="add"
            FAB_label="Желание"
            FAB_onClick={() => {
              router.push("/add")
            }}
            FAB_size="sm"
          />
        </>
      ) : (
        <>
          <NavigationRail
            pages={PAGES}
            FAB
            FAB_icon="add"
            FAB_label="Желание"
            FAB_color="primary"
            FAB_onClick={() => {
              router.push("/add")
            }}
            FAB_size="sm"></NavigationRail>
          <TopAppBar withRail variant="small" />
          <Content navigationType="rail" topBarSize="sm" withPad>
            <Container gap="sm" withPad withoutBg>
              {children}
            </Container>
          </Content>
        </>
      )}
    </>
  )
}
