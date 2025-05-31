import style from "./List.module.css"
export default function List({ withoutPad = false, children }: { withoutPad?: boolean; children?: React.ReactNode }) {
  return <div className={style.new + " " + (withoutPad ? "" : style.list)}>{children}</div>
}
