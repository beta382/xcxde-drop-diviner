import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

/**
 * A component which displays status text, with delayed fade-out and optional
 * error text.
 *
 * @param props Component props
 * @param props.value The value to display
 * @param props.errorText Error text, which is displayed instead of value if
 *   present
 * @param props.isVisible Whether the status should show
 * @param props.fadeoutMs The fade out animation duration
 * @param props.fadeoutDelay The delay before the fades out
 * @param props.shouldImmediatelyHide Whether the should be immediately hidden
 * @returns The component
 */
export function StatusText({
  value,
  errorText,
  isVisible,
  fadeoutMs = 1000,
  fadeoutDelay = 4000,
  shouldImmediatelyHide = false,
}: {
  value: string | undefined;
  errorText?: string;
  isVisible: boolean | undefined;
  fadeoutMs?: number;
  fadeoutDelay?: number;
  shouldImmediatelyHide?: boolean;
}) {
  const [shouldHide, setShouldHide] = useState(true);
  if ((isVisible ?? false) && shouldHide) {
    setShouldHide(false);
  }

  useEffect(() => {
    if (isVisible ?? true) {
      return;
    }

    const timerId = setTimeout(() => {
      setShouldHide(true);
    }, fadeoutDelay);

    return () => {
      clearInterval(timerId);
    };
  }, [fadeoutDelay, isVisible]);

  return (
    <Fade
      in={!(shouldHide || shouldImmediatelyHide)}
      timeout={{
        appear: 0,
        enter: 0,
        exit: shouldImmediatelyHide ? 0 : fadeoutMs,
      }}
    >
      {errorText === undefined ? (
        value !== undefined ? (
          <Typography
            sx={{
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </Typography>
        ) : (
          <div />
        )
      ) : (
        <Typography color="error">{errorText}</Typography>
      )}
    </Fade>
  );
}
