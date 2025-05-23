"use client";
import Content from "@/components/ui/content/Content";
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar";
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/app/home.module.css";
import { createContext, StrictMode, useEffect, useState } from "react";
import NavigationRail from "@/components/ui/navigation_rail/NavigationRail";
import Section from "@/components/ui/section/Section";
import Container from "@/components/ui/container/Container";
import { useUnit } from "effector-react";
import { $user, handleFetchUser } from "@/context/user";

export type PageConfig = {
  title: string;
  label?: string;
  path: string;
  icon?: string;
  isNav?: boolean;
};
export type NavItemConfig = {
  label: string;
  icon: string;
  action: () => void;
};

export const Context = createContext(null);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Роутер
  const router = useRouter();

  // Контекст
  const [user, fetchUser] = useUnit([$user, handleFetchUser]);

  // Переменные
  const [isMobile, setIsMobile] = useState(false);
  const pathName = usePathname();

  // Эффекты
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Брекпоинт, например, 768px
    };

    checkIfMobile(); // Проверяем при загрузке
    window.addEventListener("resize", checkIfMobile); // И при изменении размера
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    console.log("clientsrcapp(application)layout.tsx");
    fetchUser();
  }, []);

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
    {
      title: "Добавить",
      label: "Добавить",
      path: "/add",
      icon: "add",
      isNav: true,
    },
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
  ];

  const NAVS: NavItemConfig[] = [
    {
      label: "Главная",
      icon: "home",
      action: () => {
        router.push("/main");
      },
    },
    {
      label: "Друзья",
      icon: "group",
      action: () => {
        router.push("/friends");
      },
    },
    {
      label: "Добавить",
      icon: "add",
      action: () => {
        router.push("/add");
      },
    },
    {
      label: "Списки",
      icon: "bookmark",
      action: () => {
        router.push("/lists");
      },
    },
    {
      label: "Профиль",
      icon: "account_circle",
      action: () => {
        router.push("/profile");
      },
    },
  ];

  return (
    <>
      {isMobile ? (
        <>
          <TopAppBar title={PAGES.find((page) => page.path == pathName)?.title} variant="small" />
          <Content navigationType="bar" topBarSize="sm" withoutPad>
            <Container>{children}</Container>
          </Content>
          <NavigationBar pages={PAGES} />
        </>
      ) : (
        <>
          <NavigationRail pages={PAGES}></NavigationRail>
          <TopAppBar withRail title={PAGES.find((page) => page.path == pathName)?.title} variant="large" />
          <Content navigationType="rail" topBarSize="lg">
            <Container gap="md" withPad>
              {children}
            </Container>
          </Content>
        </>
      )}
    </>
  );
}
