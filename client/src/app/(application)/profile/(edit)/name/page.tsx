"use client";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import Section from "@/components/ui/section/Section";
import { $isAuth, $user, handleUpdateInfo } from "@/context/user";
import { IUser } from "@/types/user";
import { useUnit } from "effector-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NamePage() {
  //Роутер
  const router = useRouter();

  // Контекст
  const [isAuth, user, handle] = useUnit([$isAuth, $user, handleUpdateInfo]);

  // Переменные
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  // Эффекты
  useEffect(() => {
    setFirstname(user.fullname ? user.fullname?.split(" ")[0] : "");
    setLastname(user.fullname ? user.fullname?.split(" ")[1] : "");
  }, []);

  // Обработчики
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      handle({ fullname: firstname + " " + lastname });
      router.back();
    } catch (error) {}
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <Section padding_top_size="lg">
          <Input labelText="Имя" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          <Input labelText="Фамилия" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </Section>
        <Section title="Кто может видеть ваше имя" padding_top_size="lg">
          <p>
            Эту информацию смогут увидеть любые пользователи, которые будут общаться с вами или просматривать созданный вами контент в сервисе
            WishWave. Подробнее…
          </p>
        </Section>
        <Section padding_top_size="lg" padding_bot_size="lg">
          <div className="flex justify-end">
            <Button
              variant="text"
              type="reset"
              onClick={() => {
                router.back();
              }}>
              Отмена
            </Button>
            <Button variant="filled" type="submit">
              Сохранить
            </Button>
          </div>
        </Section>
      </form>
    </>
  );
}
