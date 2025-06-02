import style from "./Loader.module.css"

export default function Loader({ fit = false }: { fit?: boolean }) {
  return <span className={style.loader + " " + (fit ? null : style.absolute)}></span>
}
