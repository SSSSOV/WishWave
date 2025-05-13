"use client";
import ContentContainer from "@/components/ui/content_container/ContentContainer";
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar";
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar";
import { usePathname, useRouter } from "next/navigation";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import NavigationRail from "@/components/ui/navigation_rail/NavigationRail";

export type PageConfig = {
  title: string;
  label: string;
  path: string;
  icon: string;
  isNav: boolean;
};
export type NavItemConfig = {
  label: string;
  icon: string;
  action: () => void;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Брекпоинт, например, 768px
    };

    checkIfMobile(); // Проверяем при загрузке
    window.addEventListener("resize", checkIfMobile); // И при изменении размера
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const pathName = usePathname();

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
          <ContentContainer size="sm">{children}</ContentContainer>
          <NavigationBar pages={PAGES} />
        </>
      ) : (
        <>
          <NavigationRail pages={PAGES}></NavigationRail>
          <TopAppBar
            withRail
            title={PAGES.find((page) => page.path == pathName)?.title}
            variant="large"
          />
          <ContentContainer navigationType="rail" size="lg">
            {children}
          </ContentContainer>
        </>
      )}
    </>
  );
}
