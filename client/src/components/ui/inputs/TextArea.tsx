import React from "react"
import styles from "./Input.module.css"
import Button from "../buttons/Button"

export default function TextArea({
  leadingIcon,
  trailingIcon,
  labelText,
  inputText,
  isFull = false,
  isMultiline = false,
  id,
  ...props
}: {
  leadingIcon?: string
  trailingIcon?: string
  labelText?: string
  inputText?: string
  isFull?: boolean
  isMultiline?: boolean
  id?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={styles.textarea_field + " " + (isFull ? styles.w_full : "")}>
      {leadingIcon ? <Button variant="text" icon={leadingIcon}></Button> : ""}
      {/* <span className={"material-symbols-rounded " + styles.icon}>search</span> */}
      <div className={styles.input_container}>
        <textarea className={styles.input} id={id} placeholder=" " {...props} />

        <label htmlFor={id} className={styles.label}>
          {labelText}
        </label>
      </div>
      {/* <span className={"material-symbols-rounded " + styles.icon}>close</span> */}
      {trailingIcon ? <Button variant="text" icon={trailingIcon}></Button> : ""}
    </div>
  )
}
