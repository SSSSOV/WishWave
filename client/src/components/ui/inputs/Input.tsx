import React, { HTMLAttributes, InputHTMLAttributes } from "react";
import styles from "./Input.module.css";
import Button from "../buttons/Button";

export default function Input({
  leadingIcon,
  trailingIcon,
  labelText,
  inputText,
  id,
  ...props
}: {
  leadingIcon?: string;
  trailingIcon?: string;
  labelText?: string;
  inputText?: string;
  id?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={styles.text_field}>
      {leadingIcon ? <Button variant="text" icon={leadingIcon}></Button> : ""}
      {/* <span className={"material-symbols-rounded " + styles.icon}>search</span> */}
      <div className={styles.input_container}>
        <input className={styles.input} id={id} type="text" placeholder=" " {...props}></input>
        <label htmlFor={id} className={styles.label}>
          {labelText}
        </label>
      </div>
      {/* <span className={"material-symbols-rounded " + styles.icon}>close</span> */}
      {trailingIcon ? <Button variant="text" icon={trailingIcon}></Button> : ""}
    </div>
  );
}
