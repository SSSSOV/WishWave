"use client";
import Button from "@/components/ui/buttons/Button";
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle";
import Content from "@/components/ui/content/Content";
import Input from "@/components/ui/inputs/Input";
import Monogram from "@/components/ui/monogram/Monogram";
import Section from "@/components/ui/section/Section";
import styles from "@/app/home.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createEvent, createStore } from "effector";
import { useUnit } from "effector-react";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  // Маршрутизатор
  const router = useRouter();

  // Переменные
  const [loginOrEmail, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const { user, signIn } = useUser();

  // Обработчик авторизации
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(user);
      await signIn(loginOrEmail, password);
      console.log(user);
      toast.success("asas");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <>
      <ThemeToggle isAbsolute></ThemeToggle>
      <Content topBarSize="none" navigationType="none">
        <Section
          align_items="right"
          items_direction="row"
          padding_top_size="lg"
          padding_bot_size="lg">
          <Monogram letter="ww" size="md" color="primary"></Monogram>
          <Monogram icon="person" size="md" color="secondary"></Monogram>
          <Monogram icon="login" size="md" color="tertiary"></Monogram>
        </Section>
        <form action="login" onSubmit={handleSubmit}>
          <Section title="Уже есть аккаунт? Входите!" title_size="md">
            <Input
              labelText="Логин или почта"
              leadingIcon="person"
              type="text"
              id="login"
              value={loginOrEmail}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
            <Input
              labelText="Пароль"
              leadingIcon="password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button variant="text" isPadNone>
              Забыли пароль?
            </Button>
            <Button variant="filled" isFit={false} type="submit">
              Войти
            </Button>
          </Section>
        </form>
        <Section align_items="center" padding_top_size="lg">
          <Section items_direction="row">
            Нет аккаунта?
            <Button variant="text" isPadNone onClick={() => router.replace("/signup")}>
              Создайте его
            </Button>
          </Section>
        </Section>
      </Content>
      <Section align_items="center" padding_bot_size="lg" padding_top_size="lg">
        <span className={styles.text_center + " " + styles.label}>
          Продолжая, вы соглашаетесь с{" "}
          <a
            className={styles.link}
            href="/documents#terms"
            target="_blank"
            rel="noopener noreferrer">
            Условиями обслуживания WishWave
          </a>{" "}
          и подтверждаете, что ознакомились с нашей{" "}
          <a
            className={styles.link}
            href="/documents#policy"
            target="_blank"
            rel="noopener noreferrer">
            Политикой конфиденциальности
          </a>
          .
        </span>
      </Section>
    </>
  );
}
