"use client"
import { usePathname, useRouter } from "next/navigation"
import styles from "./NavigationBar.module.css"
import NavItem from "./NavItem"
import { PageConfig } from "@/app/(application)/layout"
import { MouseEventHandler } from "react"
import FABButton, { FAB_color, FAB_size } from "../buttons/FABButton"

export default function NavigationBar({
  pages,
  FAB,
  FAB_label,
  FAB_icon,
  FAB_size,
  FAB_color,
  FAB_onClick,
}: {
  pages: PageConfig[]
  FAB?: boolean
  FAB_label?: string
  FAB_icon?: string
  FAB_size?: FAB_size
  FAB_color?: FAB_color
  FAB_onClick?: MouseEventHandler<HTMLButtonElement>
}) {
  const router = useRouter()
  const pathName = usePathname()
  return (
    <>
      {FAB ? (
        <div className={styles.FAB_place}>
          <FABButton button_color={FAB_color} button_size={FAB_size} icon={FAB_icon} label={FAB_label} onClick={FAB_onClick} hasShadow />
        </div>
      ) : null}
      <div className={styles.container}>
        {pages
          ? pages.map((page) =>
              page.isNav ? (
                <NavItem
                  key={page.label}
                  isSelected={pathName == page.path}
                  icon={page.icon}
                  label={page.label}
                  onClick={() => {
                    router.push(page.path)
                  }}
                />
              ) : (
                ""
              )
            )
          : ""}
      </div>
    </>
  )
}
