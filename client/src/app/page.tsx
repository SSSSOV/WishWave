// import { Button } from "@/components/ui/buttons/button";
import { Button } from "@/components/ui/buttons/Button";
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle";

export default function Home() {
  return (
    <div>
      Главная страница
      <ThemeToggle></ThemeToggle>
      <Button variant="outlined" icon="light_mode" iconPosition="left">
        Like
      </Button>
    </div>
  );
}
