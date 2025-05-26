export type headline_type = "text" | "date" | undefined;
export type overline_type = "text" | "date" | undefined;

export interface ISelectItem {
  id: number;
  headline: string;
  overline?: string;
  overlineType?: overline_type;
}

export default function SelectItem(props: ISelectItem) {
  return (
    <option value={props.id}>
      {props.headline}{" "}
      {props.overline ? " (" + (props.overlineType == "date" ? new Date(props.overline).toLocaleDateString() : +props.overline) + ")" : ""}
    </option>
  );
}
