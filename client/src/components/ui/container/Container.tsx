import style from "./Container.module.css";

type size = "none" | "sm" | "md" | "lg" | "xl";

export default function Container({
  padding_top = "none",
  padding_x = "none",
  gap = "none",
  withPad = false,
  children,
}: {
  padding_top?: size;
  padding_x?: size;
  gap?: size;
  withPad?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={
        style.container +
        " " +
        (padding_top == "none"
          ? ""
          : padding_top == "sm"
          ? style.pt_sm
          : padding_top == "md"
          ? style.pt_md
          : padding_top == "lg"
          ? style.pt_lg
          : style.pt_xl) +
        " " +
        (padding_top == "none"
          ? ""
          : padding_x == "sm"
          ? style.px_sm
          : padding_x == "md"
          ? style.px_md
          : padding_x == "lg"
          ? style.px_lg
          : style.px_xl) +
        " " +
        (gap == "none"
          ? ""
          : gap == "sm"
          ? style.gap_sm
          : gap == "md"
          ? style.gap_md
          : gap == "lg"
          ? style.gap_lg
          : style.gap_xl) +
        " " +
        (withPad ? style.with_pad : "")
      }>
      {children}
    </div>
  );
}
