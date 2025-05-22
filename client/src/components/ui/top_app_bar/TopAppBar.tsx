"use client";
import Button from "../buttons/Button";
import styles from "./TopAppBar.module.css";
import { useRouter } from "next/navigation";

type top_app_bar_variant = "center" | "small" | "medium" | "large";

export default function TopAppBar({
  title,
  variant,
  withRail = false,
}: {
  title?: string;
  variant?: top_app_bar_variant;
  withRail?: boolean;
}) {
  const router = useRouter();

  return !variant || variant == "center" || variant == "small" ? (
    <>
      <div className={styles.top_app_bar + " " + (withRail ? styles.with_rail : "")}>
        <div className={styles.leading_icon}>
          <Button
            variant="text"
            icon="arrow_back"
            onClick={() => {
              router.back();
            }}></Button>
        </div>
        <div className={variant != "small" ? styles.title_center : styles.title_sm}>
          <span>{title}</span>
        </div>
        <div className={styles.trailing_icon}>
          {/* <Button variant="text" icon="notifications"></Button> */}
          <Button variant="text" icon="settings" href="/settings"></Button>
        </div>
      </div>
    </>
  ) : (
    <>
      <div
        className={
          (variant == "medium" ? styles.top_app_bar_md : styles.top_app_bar_lg) +
          " " +
          (withRail ? styles.with_rail : "")
        }>
        <div className={styles.icons}>
          <div className={styles.leading_icon}>
            <Button
              variant="text"
              icon="arrow_back"
              onClick={() => {
                router.back();
              }}></Button>
          </div>
          <div className={styles.trailing_icon}>
            <Button variant="text" icon="notifications"></Button>
            <Button variant="text" icon="settings" href="/settings"></Button>
          </div>
        </div>
        <div className={styles.title_md_lg}>
          <span>{title}</span>
        </div>
      </div>
    </>
  );
}
