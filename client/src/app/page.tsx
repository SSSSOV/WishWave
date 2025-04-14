// import { Button } from "@/components/ui/buttons/button";
import Button from "@/components/ui/buttons/Button";
import { ThemeToggle } from "@/components/ui/buttons/ThemeToggle";

export default function Home() {
  return (
    <div className="m-4 flex flex-col gap-4">
      Главная страница
      <ThemeToggle></ThemeToggle>
      <div className="flex flex-col gap-4 border w-fit p-4 rounded-md bg-cyan-50 surface">
        Обычные кнопки:
        <div className="row flex gap-4">
          <Button variant="elevated">Elevated</Button>
          <Button variant="elevated" icon="add">
            Elevated
          </Button>
          <Button variant="elevated" icon="add"></Button>
        </div>
        <div className="row flex gap-4">
          <Button variant="filled">Filled</Button>
          <Button variant="filled" icon="add">
            Filled
          </Button>
          <Button variant="filled" icon="add"></Button>
        </div>
        <div className="row flex gap-4">
          <Button variant="filled_tonal">Filled tonal</Button>
          <Button variant="filled_tonal" icon="add">
            Filled tonal
          </Button>
          <Button variant="filled_tonal" icon="add"></Button>
        </div>
        <div className="row flex gap-4">
          <Button variant="outlined">Outlined</Button>
          <Button variant="outlined" icon="add">
            Outlined
          </Button>
          <Button variant="outlined" icon="add"></Button>
        </div>
        <div className="row flex gap-4">
          <Button variant="text">Text</Button>
          <Button variant="text" icon="add">
            Text
          </Button>
          <Button variant="text" icon="add"></Button>
        </div>
      </div>
    </div>
  );
}
