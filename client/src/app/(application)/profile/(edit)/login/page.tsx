import Button from "@/components/ui/buttons/Button"
import Input from "@/components/ui/inputs/Input"
import Section from "@/components/ui/section/Section"

export default function LoginPage() {
  return (
    <>
      <Section padding_top_size="lg">
        <Input labelText="Логин" />
      </Section>
      <Section title="Кто может видеть ваш логин" padding_top_size="lg">
        <p>
          Эту информацию смогут увидеть любые пользователи, которые будут общаться с вами или просматривать созданный вами контент в сервисе WishWave.
          Подробнее…
        </p>
      </Section>
      <Section padding_top_size="lg" padding_bot_size="lg">
        <div className="flex justify-end">
          <Button variant="text">Отмена</Button>
          <Button variant="filled">Сохранить</Button>
        </div>
      </Section>
    </>
  )
}
