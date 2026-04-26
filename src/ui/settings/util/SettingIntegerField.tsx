import { t } from "i18next";
import { InputIconButtonAdornment } from "~/ui/common/components/InputIconButtonAdornment";
import { IntegerField } from "~/ui/common/components/IntegerField";
import { useLockout } from "~/ui/common/contexts/lockout/lockout-context";
import { Setting, type SettingProps } from "~/ui/settings/util/Setting";

export function SettingIntegerField({
  label,
  value,
  defaultValue,
  placeholder,
  min,
  max,
  onChange,
  ...settingProps
}: {
  label: string;
  value: number | undefined;
  defaultValue: number | undefined;
  placeholder?: string;
  min?: number;
  max?: number;
  onChange: (nextValue: number | undefined) => void;
} & SettingProps) {
  const lockout = useLockout("global");

  return (
    <Setting {...settingProps}>
      <IntegerField
        label={label}
        placeholder={placeholder}
        size="small"
        fullWidth
        disabled={lockout}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        slotProps={{
          input: {
            endAdornment: (
              <InputIconButtonAdornment
                tooltip={
                  defaultValue !== undefined
                    ? t(($) => $.settings.tooltip.restoreDefault, {
                        value: defaultValue,
                      })
                    : t(($) => $.settings.tooltip.restoreDefaultEmpty)
                }
                disabled={value === defaultValue || lockout}
                onClick={() => {
                  onChange(defaultValue);
                }}
              >
                undo
              </InputIconButtonAdornment>
            ),
          },
          inputLabel: { shrink: true },
        }}
      />
    </Setting>
  );
}
