import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { Setting, type SettingProps } from "~/ui/settings/util/Setting";

export function SettingSwitch({
  label,
  checked,
  onChange,
  ...settingProps
}: {
  label: string;
  checked: boolean;
  onChange: (nextChecked: boolean) => void;
} & SettingProps) {
  const lockout = useLockout("global");

  return (
    <Setting {...settingProps}>
      <Typography
        color={lockout ? "textDisabled" : undefined}
        sx={{ flexGrow: 1 }}
      >
        {label}
      </Typography>
      <Switch
        disabled={lockout}
        checked={checked}
        onChange={(evt) => {
          onChange(evt.target.checked);
        }}
        sx={{ marginRight: "-12px" }}
      />
    </Setting>
  );
}
