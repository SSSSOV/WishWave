import React from "react";
import styles from "./Button.module.css";

// Напиши мне компонент кнопки из Google Material Design 3.
// Получается варианты кнопки: elevated, filled, filled_tonal, outlined, text, icon, fab
// У кнопки есть 5 состояний: Enabled, Disabled, Hovered, Focused, Pressed
// Для кнопок типа elevated, filled, filled tonal, outlined и text:
// container height: 40px, container shape: 20px corner radius, icon size: 18px, Left/right padding: 24px, Left padding with-icon: 16px, Right padding with-icon: 24px, Padding between elements: 8px, Label text alignment: Center-aligned
// У text: Left/right padding: 12px, Left padding with-icon: 12px, Right padding with-icon: 16px
// У fab: Container height: 56px, Container shape: 16px corner radius, Container width: 56px, Padding: 16px, Icon size: 24px
// Если кнопка icon (без текста, только иконка), то она может быть filled, filled_tonal, outlined, и standard
// У кнопки icon: Icon size: 24px, Container size: 40px, Target size:	48px

type ButtonVariant =
  | "elevated"
  | "filled"
  | "filled_tonal"
  | "outlined"
  | "text"
  | "fab"
  | "icon_filled"
  | "icon_filled_tonal"
  | "icon_outlined"
  | "icon";

type ButtonState = "enabled" | "disabled" | "hovered" | "focused" | "pressed";

type ButtonProps = {
  variant?: ButtonVariant;
  state?: ButtonState;
  icon?: string;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = "filled",
  state = "enabled",
  icon,
  iconPosition = "left",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  // Базовые классы
  let classes = [
    styles.button,
    // "focus:outline-none focus:ring-2 focus:ring-offset-2",
    // "disabled:opacity-50 disabled:cursor-not-allowed",
  ];

  // Размеры и отступы
  if (["elevated", "filled", "filled_tonal", "outlined", "text"].includes(variant)) {
    classes.push("h-10 rounded-[20px] px-6 gap-2");
    if (variant === "text") {
      if (!icon) classes.push("px-3");
      else if (iconPosition === "left") classes.push("pl-4 pr-6");
      else if (iconPosition === "right") classes.push("pl-6 pr-4");
    }
  } else if (variant === "fab") {
    classes.push("h-14 w-14 rounded-[16px] p-4");
  } else if (variant === "icon") {
    classes.push("h-10 w-10 p-2 rounded-full");
  }

  // Варианты
  // if (variant === "elevated") {
  //   classes.push("bg-surface shadow hover:shadow-md active:shadow-sm");
  //   if (state === "pressed") classes.push("shadow-md");
  // } else if (variant === "filled") {
  //   classes.push("bg-primary text-on-primary");
  // } else if (variant === "filled_tonal") {
  //   classes.push("bg-primary-container text-on-primary-container");
  // } else if (variant === "outlined") {
  //   classes.push("border border-outline bg-transparent");
  // } else if (variant === "text") {
  //   classes.push("bg-transparent");
  // } else if (variant === "fab") {
  //   classes.push("bg-primary-container text-on-primary-container shadow-md");
  // } else if (variant === "icon") {
  //   classes.push("bg-transparent");
  // } else if (variant === "icon_filled") {
  //   classes.push("bg-primary text-on-primary");
  // } else if (variant === "icon_filled_tonal") {
  //   classes.push("bg-primary-container text-on-primary-container");
  // } else if (variant === "icon_outlined") {
  //   classes.push("border border-outline bg-transparent");
  // }

  // Состояния
  // if (state === "hovered") {
  //   if (variant === "filled") classes.push("hover:bg-primary-hovered");
  //   else if (variant === "filled_tonal") classes.push("hover:bg-primary-container-hovered");
  // } else if (state === "pressed") {
  //   if (variant === "filled") classes.push("bg-primary-pressed");
  //   else if (variant === "filled_tonal") classes.push("bg-primary-container-pressed");
  // } else if (state === "focused") {
  //   classes.push("ring-2 ring-primary");
  // }

  // Размер иконки
  const iconSize = variant === "fab" ? 24 : variant === "icon" ? 24 : 18;

  return (
    <button
      className={`${classes.join(" ")} ${className}`}
      disabled={state === "disabled"}
      {...props}>
      {/* {icon && iconPosition === "left" && <MaterialSymbol icon={icon} size={iconSize} />} */}
      {icon && iconPosition === "left" && <span className="material-symbols-rounded">{icon}</span>}

      {variant !== "fab" && variant !== "icon" && children}

      {icon && iconPosition === "right" && <span className="material-symbols-rounded">{icon}</span>}
    </button>
  );
};
