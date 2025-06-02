"use client"; // ← Обязательно для Next.js 13+
import React, { useState } from "react";
import ReactSelect, { SingleValue, StylesConfig } from "react-select";

interface OptionType {
  value: string;
  label: string;
}

const customStyles: StylesConfig<OptionType> = {
  control: (provided) => ({
    ...provided,
    width: "100%",
    backgroundColor: "transparent",
    border: "1px solid var(--outline)",
    fontSize: "16px",
    padding: "var(--xs)",
    borderRadius: "var(--xs)",
    transition: "all 0.2s",
    height: "56px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--outline)",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    margin: "0px",
    color: "var(--outline)",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--surface-container)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--primary-container)" // цвет для выбранного элемента
      : "transparent",
    color: state.isSelected
      ? "var(--on-primary-container)" // цвет текста выбранного элемента
      : "var(--on-primary-container)",
    "&:active": {
      backgroundColor: "var(--primary-container)", // цвет при активном нажатии
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--on-surface)",
    margin: "0px",
    ":active": {
      backgroundColor: "var(--primary)",
      color: "var(--on-primary)",
    },
  }),

  // Дополнительные стили для других частей select
};

const options: OptionType[] = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function Select() {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  return (
    <ReactSelect
      styles={customStyles}
      instanceId="fixed-select"
      value={selectedOption}
      onChange={(newValue) => setSelectedOption(newValue)}
      options={options}
      isMulti={false}
    />
  );
}
