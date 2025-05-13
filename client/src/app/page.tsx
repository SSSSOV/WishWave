"use client";
import Button from "@/components/ui/buttons/Button";
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle";
import Input from "@/components/ui/inputs/Input";
import NavigationBar from "@/components/ui/navigation_bar/NavigationBar";
import TopAppBar from "@/components/ui/top_app_bar/TopAppBar";
import styles from "@/app/home.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 m-4">
      <ThemeToggle isAbsolute></ThemeToggle>
      <div className="h-screen flex flex-col gap-10 justify-center">
        <p className={styles.headline}>
          Приветствуем вас на <ins>WishWave</ins> — вашем месте для создания и обмена вишлистами!
        </p>
        <p className={styles.title}>
          Поделитесь своими желаниями с друзьями и получайте только <i>самые желанные подарки</i>.{" "}
        </p>
        <div className="flex gap-4 w-full justify-end">
          <Button
            variant="text"
            icon="login"
            onClick={() => {
              router.push("/login");
            }}>
            Вход
          </Button>
          <Button
            variant="filled"
            icon="person_add"
            onClick={() => {
              router.push("/signup");
            }}>
            Регистрация
          </Button>
        </div>
      </div>
      <hr />
      <ol className="py-10">
        <ul className={styles.title + " " + styles.ul}>
          🔹 Создавайте вишлисты на любой случай: дни рождения, свадьбы, Новый год или просто потому
          что.
        </ul>
        <ul className={styles.title + " " + styles.ul}>
          🔹 Делитесь списками с друзьями и близкими — пусть они точно знают, что вам понравится.
        </ul>
        <ul className={styles.title + " " + styles.ul}>
          🔹 Отмечайте подарки, чтобы избежать повторов и неожиданных сюрпризов.
        </ul>
        <ul className={styles.title + " " + styles.ul}>
          🔹 Открывайте для себя желания других и вдохновляйтесь!
        </ul>
      </ol>
      <hr />
      <p className={styles.headline}>✨ Почему WishWave?</p>
      <ol>
        <ul className={styles.title}>✅ Простота и удобство — добавляйте желания в пару кликов.</ul>
        <ul className={styles.title}>
          ✅ Гибкие настройки приватности — открытый список или только для избранных.
        </ul>
        <ul className={styles.title}>
          ✅ Уведомления и напоминания — никогда не пропустите важные даты.
        </ul>
      </ol>
      <p className={styles.headline}>
        Присоединяйтесь сейчас и превратите процесс дарения в удовольствие!
      </p>
    </div>
  );
}
