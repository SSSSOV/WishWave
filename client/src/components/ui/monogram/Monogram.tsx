import style from "./Monogram.module.css"

type monogram_size = "xs" | "sm" | "md" | "lg"
type color = "primary" | "secondary" | "tertiary" | "access" | "warning" | "error" | "none"
type monogram_type = "monogram" | "icon" | "image"

export default function Monogram({
  monogram_type,
  letter,
  icon,
  color = "primary",
  size = "xs",
  url,
  isLoading,
}: {
  monogram_type?: monogram_type
  letter?: string
  icon?: string
  color?: color
  size?: monogram_size
  url?: string
  isLoading?: boolean
}) {
  return (
    <>
      {isLoading ? (
        <div
          className={
            style.load_div +
            " " +
            (size == "xs"
              ? style.container_xs
              : size == "sm"
              ? style.container_sm
              : size == "md"
              ? style.container_md
              : size == "lg"
              ? style.container_lg
              : " ")
          }></div>
      ) : (
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
            (monogram_type == "image"
              ? style.none
              : color == "primary"
              ? style.primary
              : color == "secondary"
              ? style.secondary
              : color == "tertiary"
              ? style.tertiary
              : " ")
          }>
          {monogram_type == "image" ? (
            <img
              src={url}
              alt="img"
              className={
                style.img +
                " " +
                (size == "xs"
                  ? style.container_xs
                  : size == "sm"
                  ? style.container_sm
                  : size == "md"
                  ? style.container_md
                  : size == "lg"
                  ? style.container_lg
                  : " ")
              }
            />
          ) : monogram_type == "monogram" ? (
            <span className={style.letter}>{letter}</span>
          ) : monogram_type == "icon" ? (
            <span
              className={
                "material-symbols-rounded " +
                (size == "xs" ? style.icon_xs : size == "sm" ? style.icon_sm : size == "md" ? style.icon_md : size == "lg" ? style.icon_lg : " ")
              }>
              {icon}
            </span>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  )
}
