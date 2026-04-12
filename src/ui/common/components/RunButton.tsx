import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

export function RunButton({
  runText,
  cancelText,
  isRunning,
  disabled,
  onStart,
  onCancel,
}: {
  runText: string;
  cancelText?: string;
  isRunning: boolean;
  disabled?: boolean;
  onStart: () => void;
  onCancel: () => void;
}) {
  const [t] = useTranslation();

  if (cancelText === undefined) {
    cancelText = t(($) => $.common.cancel);
  }

  return (
    <Button
      variant="contained"
      color={isRunning ? "error" : "primary"}
      fullWidth
      disabled={disabled}
      onClick={isRunning ? onCancel : onStart}
      sx={{ minHeight: "100%" }}
    >
      {isRunning ? cancelText : runText}
    </Button>
  );
}
