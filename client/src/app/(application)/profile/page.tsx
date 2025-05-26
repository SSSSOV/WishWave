"use client";
import Button from "@/components/ui/buttons/Button";
import List from "@/components/ui/list/List";
import ListItem from "@/components/ui/list/ListItem";
import Monogram from "@/components/ui/monogram/Monogram";
import Section from "@/components/ui/section/Section";
import { useEffect, useState } from "react";
import style from "@/app/home.module.css";
import { useRouter } from "next/navigation";
import { useUnit } from "effector-react";
import { $isAuth, $user, handleLogeOut } from "@/context/user";
import { hasNameContent } from "@/lib/utils/hasNameContent";
import { getInitials } from "@/lib/utils/getInitials";

export default function ProfilePage() {
  //Роутер
  const router = useRouter();

  // Переменные
  const [isLoading, setIsLoading] = useState(false);

  // Контекст
  const [isAuth, user, logOut] = useUnit([$isAuth, $user, handleLogeOut]);

  // Эффекты

  const handleExit = () => {
    logOut();
    window.location.href = "/login";
  };

  return !isAuth ? (
    <Section align_items="center" title="Вы не авторизованы" title_size="sm" padding_top_size="lg">
      <div className="flex flex-row gap-4">
        <Button
          variant="text"
          onClick={() => {
            router.push("signup/");
          }}>
          Регистрация
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            router.push("login/");
          }}>
          Вход
        </Button>
      </div>
    </Section>
  ) : (
    <>
      <Section align_items="center" padding_top_size="lg">
        <Monogram
          monogram_type={user.image ? "image" : hasNameContent(user.fullname) ? "monogram" : "icon"}
          letter={hasNameContent(user.fullname) ? getInitials(user.fullname) : "person"}
          icon="person"
          size="md"
          url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + user.image}
          isLoading={isLoading}
        />
      </Section>
      <Section align_items="center">
        <span className={style.title}>{user.fullname && user.fullname != " " && user.fullname != "" ? user.fullname : ""}</span>
        <span className={style.body}>{user.login}</span>
      </Section>
      <Section title="Информация вашего профиля в сервсие WishWave" title_size="md" padding_top_size="lg" padding_bot_size="lg">
        <span className={style.body}>
          Здесь можно посмотреть или изменить личную информацию. Некоторые данные, например контактные, можно сделать доступными всем, чтобы с вами
          было проще связаться.
        </span>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Основная информация" title_size="sm" padding_top_size="lg">
        <span className={style.label}>Некоторая информация может быть видна другим пользователям сервиса WishWave. Узнать больше</span>
        <List withoutPad>
          <ListItem
            condition={2}
            overline="фото профиля"
            leading_type={user.image && user.image != "" ? "image" : hasNameContent(user.fullname) ? "monogram" : "icon"}
            leading={hasNameContent(user.fullname) ? getInitials(user.fullname) : "person"}
            url={process.env.NEXT_PUBLIC_SERVER_URL + "static/" + user.image}
            headline="Персонализирует ваш аккаунт"
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              router.push("/profile/image");
            }}
          />

          <ListItem
            condition={2}
            overline="имя"
            headline={user.fullname && hasNameContent(user.fullname) ? user.fullname : "Не указано"}
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              router.push("/profile/name");
            }}
          />
          <ListItem
            condition={2}
            overline="дата рождения"
            headline={
              user.birthday
                ? new Date(user.birthday).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Не указано"
            }
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              router.push("/profile/birthday");
            }}
          />
          <ListItem
            condition={2}
            overline="пол"
            headline={user.gender ? user.gender : "Не указано"}
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              router.push("/profile/gender");
            }}
          />
          <ListItem
            condition={2}
            overline="логин"
            headline={user.login ? user.login : "Не указано"}
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              router.push("/profile/login");
            }}
          />
          <ListItem
            condition={2}
            overline="пароль"
            headline={"Нажмите, чтобы изменить"}
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              router.push("/profile/password");
            }}
          />
        </List>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section title="Контактная информация" title_size="sm" padding_top_size="lg">
        <List withoutPad>
          <ListItem
            condition={2}
            overline="почта"
            headline={user.email ? user.email : "Не указано"}
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              router.push("/profile/email");
            }}
          />
          <ListItem
            condition={2}
            overline="телефон"
            headline={user.phone ? user.phone : "Не указано"}
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              router.push("/profile/phone");
            }}
          />
        </List>
      </Section>
      <Section>
        <hr />
      </Section>
      <Section padding_bot_size="lg" align_items="right">
        <Section items_direction="row" isFit withoutPad>
          <Button variant="text" color="error" icon="delete">
            Удалить аккаунт
          </Button>
          <Button variant="text" color="error" onClick={handleExit} icon="logout">
            Выйти
          </Button>
        </Section>
      </Section>
      {/* <Section>
        <hr />
      </Section> */}
      {/* <Section title="Социальные сети:" title_size="sm" padding_top_size="lg">
        <List withoutPad>
          <ListItem
            condition={2}
            overline="Telegram"
            headline="@ssssov"
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              alert("asas");
            }}
          />
          <ListItem
            condition={2}
            overline="ВКонтакте"
            headline="Отсутствует"
            trailing_type="icon"
            isLoading={isLoading}
            onClick={() => {
              alert("asas");
            }}
          />
        </List>
      </Section> */}{" "}
    </>
  );
}
