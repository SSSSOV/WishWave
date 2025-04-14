import React from "react";
import styles from "./Button.module.css";

export default function Button({
  children,
  variant,
  icon,
  ...props
}: {
  children?: React.ReactNode;
  variant: string;
  icon?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  let buttonClasses = "";
  if (variant == "elevated") buttonClasses = styles.elevated_button;
  if (variant == "filled") buttonClasses = styles.filled_button;
  if (variant == "filled_tonal") buttonClasses = styles.filled_tonal_button;
  if (variant == "outlined") buttonClasses = styles.outlined_button;
  if (variant == "text") buttonClasses = styles.text_button;

  if (icon && children) {
    buttonClasses = buttonClasses + " " + styles.with_icon;
    return (
      <button className={buttonClasses} {...props}>
        <span className={"material-symbols-rounded " + styles.icon}>{icon}</span>
        <span>{children}</span>
      </button>
    );
  } else if (icon && !children) {
    buttonClasses = buttonClasses + " " + styles.only_icon;
    return (
      <button className={buttonClasses} {...props}>
        <span className={"material-symbols-rounded "}>{icon}</span>
      </button>
    );
  } else
    return (
      <button className={buttonClasses} {...props}>
        <span>{children}</span>
      </button>
    );
}
