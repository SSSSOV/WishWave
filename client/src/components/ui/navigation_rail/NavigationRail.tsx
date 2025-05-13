"use client";
import { usePathname, useRouter } from "next/navigation";
import styles from "./NavigationRail.module.css";
import { PageConfig } from "@/app/(application)/layout";
import NavItem from "../navigation_bar/NavItem";

type rail_configuration = "default" | "with_menu" | "with_FAB" | "with_menu&FAB";

export default function NavigationRail({ pages }: { pages: PageConfig[] }) {
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
