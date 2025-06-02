"use client"
import React from "react"
import styles from "./Button.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"

type variant = "elevated" | "filled" | "filled_tonal" | "outlined" | "text"
type color = "primary" | "secondary" | "tertiary" | "access" | "warning" | "error"

export default function Button({
  children,
  variant = "filled",
  isPadNone = false,
  isFit = true,
  icon,
  href,
  color = "primary",
  isLoading = false,
  ...props
}: {
  children?: React.ReactNode
  variant?: variant
  isPadNone?: boolean
  isFit?: boolean
  icon?: string
  color?: color
  isLoading?: boolean
  href?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  let buttonClasses = ""

  if (variant == "elevated") buttonClasses = styles.elevated_button
  else if (variant == "filled") buttonClasses = styles.filled_button
  else if (variant == "filled_tonal") buttonClasses = styles.filled_tonal_button
  else if (variant == "outlined") buttonClasses = styles.outlined_button
  else if (variant == "text") buttonClasses = styles.text_button

  if (color == "primary") buttonClasses += " " + styles.primary
  else if (color == "secondary") buttonClasses += " " + styles.secondary
  else if (color == "tertiary") buttonClasses += " " + styles.tertiary
  else if (color == "access") buttonClasses += " " + styles.access
  else if (color == "warning") buttonClasses += " " + styles.warning
  else if (color == "error") buttonClasses += " " + styles.error

  if (icon && children) {
    buttonClasses = buttonClasses + " " + styles.with_icon
  }

  if (isPadNone) {
    buttonClasses = buttonClasses + " " + styles.p_none
  }
  if (isFit) {
    buttonClasses = buttonClasses + " " + styles.fit
  }

  if (href) {
    const router = useRouter()

    if (icon && children) {
      buttonClasses = buttonClasses + " " + styles.with_icon
      return (
        <button
          className={buttonClasses}
          onClick={() => {
            router.push(href)
          }}
          {...props}>
          <span className={"material-symbols-rounded " + styles.icon}>{icon}</span>
          <span>{children}</span>
        </button>
      )
    } else if (icon && !children) {
      buttonClasses = buttonClasses + " " + styles.only_icon + " " + styles.fit
      return (
        <button
          className={buttonClasses}
          onClick={() => {
            router.push(href)
          }}
          {...props}>
          <span className={"material-symbols-rounded "}>{icon}</span>
        </button>
      )
    } else
      return (
        <button
          className={buttonClasses}
          onClick={() => {
            router.push(href)
          }}
          {...props}>
          {children}
        </button>
      )
  } else if (icon && children) {
    buttonClasses = buttonClasses + " " + styles.with_icon
    return (
      <button className={buttonClasses} {...props}>
        <span className={"material-symbols-rounded " + styles.icon}>{icon}</span>
        <span>{children}</span>
      </button>
    )
  } else if (icon && !children) {
    buttonClasses = buttonClasses + " " + styles.only_icon
    return (
      <button className={buttonClasses} {...props}>
        <span className={"material-symbols-rounded "}>{icon}</span>
      </button>
    )
  } else
    return (
      <button className={buttonClasses} {...props}>
        <span>{children}</span>
      </button>
    )
}
