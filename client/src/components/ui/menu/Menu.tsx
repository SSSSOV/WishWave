"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./Menu.module.css"

export default function DropdownMenu({
  children,
  items,
  onSelect,
}: {
  children: React.ReactNode
  items: { id: number; name: string }[]
  onSelect: (id: number) => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <div className={styles.menuContainer} ref={menuRef}>
        <div onClick={toggleMenu}>{children}</div>
        {isOpen && (
          <div className={styles.menu}>
            {items.map((item) => (
              <div
                key={item.id}
                className={styles.menuItem}
                onClick={() => {
                  onSelect(item.id)
                  setIsOpen(false)
                }}>
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
