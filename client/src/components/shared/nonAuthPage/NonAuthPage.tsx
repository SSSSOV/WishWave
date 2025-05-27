import Button from "@/components/ui/buttons/Button"
import Section from "@/components/ui/section/Section"
import { useRouter } from "next/navigation"

export default function NonAuthPage() {
  const router = useRouter()

  return (
    <Section align_items="center" title="Вы не авторизованы" title_size="sm" padding_top_size="lg" padding_bot_size="lg">
      <div className="flex flex-row gap-4">
        <Button
          variant="text"
          onClick={() => {
            router.push("signup/")
          }}>
          Регистрация
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            router.push("login/")
          }}>
          Вход
        </Button>
      </div>
    </Section>
  )
}
