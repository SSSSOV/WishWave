"use client"

import { useUnit } from "effector-react"
import Button from "../buttons/Button"
import styles from "./TopAppBar.module.css"
import { useRouter } from "next/navigation"
import { $pageTitle } from "@/context/page"
import { ThemeToggle } from "../buttons/ThemeToggle"
import { useTheme } from "@/context/ThemeContext"

type top_app_bar_variant = "center" | "small" | "medium" | "large"

export default function TopAppBar({ variant, withRail = false }: { variant?: top_app_bar_variant; withRail?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const pageTitle = useUnit($pageTitle)

  return !variant || variant == "center" || variant == "small" ? (
    <>
      <div className={styles.top_app_bar + " " + (withRail ? styles.with_rail : "")}>
        <div className={styles.leading_icon}>
          <Button
            variant="text"
            icon="arrow_back"
            onClick={() => {
              router.back()
            }}></Button>
        </div>
        <div className={variant != "small" ? styles.title_center : styles.title_sm}>
          <span className={styles.title}>{pageTitle || "WishWave"}</span>
        </div>
        <div className={styles.trailing_icon}>
          <Button variant="text" onClick={toggleTheme} icon={theme === "light" ? "dark_mode" : "light_mode"} />
          <Button
            variant="text"
            icon="bug_report"
            onClick={() => {
              router.push("/bugreports/add")
            }}
          />
        </div>
      </div>
    </>
  ) : (
    <>
      <div className={(variant == "medium" ? styles.top_app_bar_md : styles.top_app_bar_lg) + " " + (withRail ? styles.with_rail : "")}>
        <div className={styles.icons}>
          <div className={styles.leading_icon}>
            <Button
              variant="text"
              icon="arrow_back"
              onClick={() => {
                router.back()
              }}></Button>
          </div>
          <div className={styles.trailing_icon}>
            <Button variant="text" onClick={toggleTheme} icon={theme === "light" ? "dark_mode" : "light_mode"} />
            <Button
              variant="text"
              icon="bug_report"
              onClick={() => {
                router.push("/bugreports/add")
              }}
            />
          </div>
        </div>
        <div className={styles.title_md_lg}>
          <span className={styles.title}>{pageTitle}</span>
        </div>
      </div>
    </>
  )
}
