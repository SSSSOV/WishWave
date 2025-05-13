"use client";
import { usePathname, useRouter } from "next/navigation";
import styles from "./NavigationBar.module.css";
import NavItem from "./NavItem";
import { PageConfig } from "@/app/(application)/layout";

export default function NavigationBar({ pages }: { pages: PageConfig[] }) {
  const router = useRouter();
  const pathName = usePathname();
  return (
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
                  router.push(page.path);
                }}
              />
            ) : (
              ""
            )
          )
        : ""}
    </div>
  );
}
