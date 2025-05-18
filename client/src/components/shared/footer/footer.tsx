import styles from "./footer.module.css";
import Button from "@/components/ui/buttons/Button";

export default function Footer() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.row}>
          <p className={styles.headline}>WishWave</p>
          <div className={styles.button_group}>
            <Button variant="text">Регистрация</Button>
            <Button variant="text">Реклама</Button>
            <Button variant="text" href="tel:+7 (961) 999-97-57">
              +7 (961) 999-97-57
            </Button>
            <Button variant="text" href="mailto:sakunovss2003@mail.ru">
              sakunovss2003@mail.ru
            </Button>
          </div>
        </div>

        <hr className={styles.hr} />

        <div className={styles.row}>
          <div className={styles.info_group}>
            <p>© 2025 ИП Фамилия Имя Отчество</p>
            <p>ИНН 000000000000</p>
            <p>ОГРНИП 000000000000000</p>
            <a
              className={styles.link}
              href="/documents#terms"
              target="_blank"
              rel="noopener noreferrer">
              Условия обслуживания
            </a>
            <a
              className={styles.link}
              href="/documents#policy"
              target="_blank"
              rel="noopener noreferrer">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
