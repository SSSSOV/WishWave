import styles from "./NavItem.module.css";

export default function NavItem({
  isSelected = false,
  label,
  icon,
  ...props
}: {
  isSelected?: boolean;
  label?: string;
  icon: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles.nav_item} {...props}>
      <div className={styles.item_icon + " " + (isSelected ? styles.selected_item_icon : "")}>
        <span id="icon" className={"material-symbols-rounded " + styles.icon}>
          {icon}
        </span>
      </div>

      {label ? <span className={styles.item_label}>{label}</span> : ""}
    </button>
  );
}
