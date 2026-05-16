import type { Breakpoint } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";

/**
 * A React hook encapsulating a timer.
 *
 * @param updateIntervalMs The interval at which to update the timer's value
 *   while running. This does not affect the precision of the timer when
 *   stopped
 * @returns An array of:
 *
 *   - Whether the timer is running, undefined if the timer has never run before
 *   - The current timer time in milliseconds, undefined if the timer has never run
 *       before
 *   - A function that starts the timer
 *   - A function that stops the timer
 */
export function useTimer(
  updateIntervalMs: number = 57, // This number feels nice
): [boolean | undefined, number | undefined, () => void, () => void] {
  const [isRunning, setIsRunning] = useState<boolean>();
  const [startMs, setStartMs] = useState<number>();
  const [intermediateMs, setIntermediateMs] = useState<number>();
  const [stopMs, setStopMs] = useState<number>();

  const shouldUpdate = useRef(false);

  useEffect(() => {
    if (!(isRunning ?? false)) {
      return;
    }

    const timerId = setInterval(() => {
      if (shouldUpdate.current) {
        setIntermediateMs(Date.now());
      }
    }, updateIntervalMs);

    return () => {
      clearInterval(timerId);
    };
  }, [isRunning, updateIntervalMs]);

  return [
    isRunning,
    startMs === undefined
      ? undefined
      : stopMs !== undefined
        ? stopMs - startMs
        : intermediateMs !== undefined
          ? intermediateMs - startMs
          : 0,
    // Start
    () => {
      const nextStartMs = Date.now();
      shouldUpdate.current = true;

      setIsRunning(true);
      setStartMs(nextStartMs);
      setIntermediateMs(nextStartMs);
      setStopMs(undefined);
    },
    // Stop
    () => {
      const nextStopMs = Date.now();
      shouldUpdate.current = false;

      setIsRunning(false);
      setIntermediateMs(undefined);
      setStopMs(nextStopMs);
    },
  ];
}

/**
 * A React+i18next hook that translates voice lines.
 *
 * @returns A function, which accepts a voice line key as an argument, and
 *   returns a string representing the translated voice line, according to the
 *   currently selected voice language, player gender, and voice actor
 */
export function useVoiceLineTranslation(): (
  voiceLineKey: VoiceLineKey,
) => string {
  const settings = useSettings();
  const [t] = useTranslation();

  return (voiceLineKey) =>
    t(
      ($) =>
        $.vas[settings.playerGender][settings.playerVoice].voiceLines[
          voiceLineKey
        ],
      {
        lng: settings.playerVoiceLanguage,
        fallbackLng: "en",
      },
    );
}

/**
 * A React hook that provides a sequentially increasing key, suitable for keying
 * component arrays that lack a good key source.
 *
 * @returns An array of:
 *
 *   - The key
 *   - A function that increments the key
 */
export function useKey(): [number, () => void] {
  const [key, setKey] = useState(Number.MIN_SAFE_INTEGER);

  return [
    key,
    () => {
      setKey((key) => key + 1);
    },
  ];
}

/**
 * Gets the current Material UI breakpoint.
 *
 * @returns The current Material UI breakpoint
 */
export function useBreakpoint(): Breakpoint {
  const isMobileLayout = useMediaQuery((theme) =>
    theme.breakpoints.only("mobile"),
  );
  const isTabletLayout = useMediaQuery((theme) =>
    theme.breakpoints.only("tablet"),
  );
  const isDesktopLayout = useMediaQuery((theme) =>
    theme.breakpoints.only("desktop"),
  );

  if (isMobileLayout) {
    return "mobile";
  } else if (isTabletLayout) {
    return "tablet";
  } else if (isDesktopLayout) {
    return "desktop";
  } else {
    console.error("Invalid MUI breakpoint state");
    return "mobile";
  }
}
