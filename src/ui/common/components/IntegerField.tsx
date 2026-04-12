import InputAdornment from "@mui/material/InputAdornment";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { mergeSlotProps } from "@mui/material/utils";
import { useState, type ChangeEvent } from "react";
import type { Except } from "type-fest";

export type IntegerFieldProps = {
  value: number | undefined;
  min?: number;
  max?: number;
  hex?: boolean;
  onChange: (value: number | undefined) => void;
} & Except<TextFieldProps, "value" | "onChange" | "onBlur" | "onKeyDown">;

/**
 * A wrapper around Material UI's TextField, which only allows integer input
 * without being a type=number input.
 *
 * Additionally, it only forwards change events when the user presses the Enter
 * key or blurs the input.
 *
 * @param props Component props
 * @param props.value The controlled value to display
 * @param props.min The minimum allowed value
 * @param props.max The maximum allowed value
 * @param props.hex Whether the number should be input and displayed in
 *   hexadecimal
 * @param props.onChange A callback containing the updated value when a change
 *   occurs
 * @param props.props Other props to pass through to the Material UI TextField
 * @returns The component
 */
export function IntegerField({
  value,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  hex = false,
  onChange,
  ...props
}: IntegerFieldProps) {
  const [prevValue, setPrevValue] = useState<typeof value | "updateme">(value);
  const [valueStr, setValueStr] = useState(valueToString());
  if (value !== prevValue) {
    setPrevValue(value);
    setValueStr(valueToString());
  }

  const validator = hex ? /^-?[0-9A-Fa-f]*$/ : /^-?[0-9]*$/;

  function valueToString(): string {
    return value?.toString(hex ? 16 : 10).toUpperCase() ?? "";
  }

  function parseValue(str: string): number | undefined {
    if (str === "") {
      return undefined;
    }

    return hex ? parseInt(str, 16) : parseInt(str);
  }

  function handleChange(evt: ChangeEvent<HTMLInputElement>): void {
    const str = evt.target.value;

    if (!validator.test(str) || (min >= 0 && str.startsWith("-"))) {
      evt.preventDefault();
      return;
    }

    const value = parseValue(str);

    if (value !== undefined && (value < min || value > max)) {
      evt.preventDefault();
      return;
    }

    setValueStr(str);
  }

  function handleSubmit(): void {
    const nextValue = parseValue(valueStr);
    if (value == nextValue) {
      return;
    }

    setPrevValue("updateme");
    onChange(nextValue);
  }

  return (
    <TextField
      value={valueStr}
      onChange={handleChange}
      onBlur={handleSubmit}
      onKeyDown={(evt) => {
        if (evt.key === "Enter") {
          handleSubmit();
        }
      }}
      {...props}
      slotProps={{
        ...props.slotProps,
        input: mergeSlotProps(props.slotProps?.input, {
          startAdornment: hex ? (
            <InputAdornment
              position="start"
              disablePointerEvents
              disableTypography
              sx={{ marginRight: 0, color: "text.secondary" }}
            >
              0x
            </InputAdornment>
          ) : undefined,
        }),
        htmlInput: mergeSlotProps(props.slotProps?.htmlInput, {
          inputMode: hex ? undefined : "numeric",
        }),
      }}
    />
  );
}
