"use client"
import { usePathname, useRouter } from "next/navigation"
import styles from "./NavigationRail.module.css"
import { PageConfig } from "@/app/(application)/layout"
import NavItem from "../navigation_bar/NavItem"
import FABButton, { FAB_color, FAB_size } from "../buttons/FABButton"
import { MouseEventHandler } from "react"

type rail_configuration = "default" | "with_menu" | "with_FAB" | "with_menu&FAB"

export default function NavigationRail({
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
    <div className={styles.container}>
      {FAB ? (
        <div className={styles.FAB_place}>
          <FABButton button_color={FAB_color} button_size={FAB_size} icon={FAB_icon} onClick={FAB_onClick} />
        </div>
      ) : null}
      <div className={styles.navs}>
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
    </div>
  )
}
