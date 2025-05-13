import style from "./Monogram.module.css";

type monogram_size = "sm" | "md" | "lg";

export default function Monogram({
  letter,
  size = "sm",
}: {
  letter: string;
  size?: monogram_size;
}) {
  return (
    <div
      className={
        size == "sm" ? style.container_sm : size == "md" ? style.container_md : style.container_lg
      }>
      <span>{letter}</span>
    </div>
  );
}
