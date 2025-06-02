import style from "./Figure.module.css"

export default function Figure({ variant = 1 }: { variant?: number }) {
  if (variant == 1)
    return (
      <div className={style.container}>
        <div className={style.figure1}>
          <svg width="1920" height="300" viewBox="0 0 1920 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 0C0 -165.685 134.315 -300 300 -300H1020C1185.69 -300 1320 -165.685 1320 0C1320 165.685 1185.69 300 1020 300H300C134.315 300 0 165.685 0 0Z"
              fill="var(--primary-container)"
            />
            <path
              d="M1320 0C1320 -165.685 1454.31 -300 1620 -300C1785.69 -300 1920 -165.685 1920 0C1920 165.685 1785.69 300 1620 300C1454.31 300 1320 165.685 1320 0Z"
              fill="var(--tertiary-container)"
            />
          </svg>
        </div>
      </div>
    )
  else
    return (
      <div className={style.container}>
        <div className={style.figure2}>
          <svg width="1920" height="600" viewBox="0 0 1920 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 300C0 134.315 134.315 0 300 0H1620C1785.69 0 1920 134.315 1920 300C1920 465.685 1785.69 600 1620 600H300C134.315 600 0 465.685 0 300Z"
              fill="var(--secondary-container)"
            />
          </svg>
        </div>
      </div>
    )
}
