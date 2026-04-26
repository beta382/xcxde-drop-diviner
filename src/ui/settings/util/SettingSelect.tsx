import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { ReactNode } from "react";
import { useLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { Setting, type SettingProps } from "~/ui/settings/util/Setting";

export function SettingSelect({
  label,
  valueIndex,
  values,
  onChange,
  ...settingProps
}: {
  label: string;
  valueIndex: number;
  values: ReactNode[];
  onChange: (nextValueIndex: number) => void;
} & SettingProps) {
  const lockout = useLockout("global");

  return (
    <Setting {...settingProps}>
      <TextField
        label={label}
        size="small"
        disabled={lockout}
        value={valueIndex}
        select
        fullWidth
        onChange={(evt) => {
          onChange(+evt.target.value);
        }}
      >
        {values.map((value, i) => (
          <MenuItem key={i} value={i}>
            {value}
          </MenuItem>
        ))}
      </TextField>
    </Setting>
  );
}
