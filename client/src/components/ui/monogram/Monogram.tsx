import style from "./Monogram.module.css";

type monogram_size = "xs" | "sm" | "md" | "lg";
type color = "primary" | "secondary" | "tertiary";

export default function Monogram({
  letter,
  icon,
  color = "primary",
  size = "xs",
}: {
  letter?: string;
  icon?: string;
  color?: color;
  size?: monogram_size;
}) {
  return (
    <div
      className={
        (size == "xs"
          ? style.container_xs
          : size == "sm"
          ? style.container_sm
          : size == "md"
          ? style.container_md
          : size == "lg"
          ? style.container_lg
          : " ") +
        " " +
        (color == "primary"
          ? style.primary
          : color == "secondary"
          ? style.secondary
          : color == "tertiary"
          ? style.tertiary
          : " ")
      }>
      {letter ? (
        <span className={style.letter}>{letter}</span>
      ) : (
        <span
          className={
            "material-symbols-rounded " +
            (size == "xs"
              ? style.icon_xs
              : size == "sm"
              ? style.icon_sm
              : size == "md"
              ? style.icon_md
              : size == "lg"
              ? style.icon_lg
              : " ")
          }>
          {icon}
        </span>
      )}
    </div>
  );
}
