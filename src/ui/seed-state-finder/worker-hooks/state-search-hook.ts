import { useEffect, useEffectEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MtRand } from "~/common/util/mt-rand";
import { PromiseWithResolvers } from "~/common/util/promise-with-resolvers";
import { useMutableRng } from "~/ui/common/contexts/rng/rng-context";
import { useSettings } from "~/ui/common/contexts/settings/settings-context";
import { createFindStateController } from "~/ui/common/workers";
import type { FindStateController } from "~/ui/common/workers/find-state/find-state.types";
import type { ResultType } from "~/ui/common/workers/workers.types";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";
import type { SearchActionResult } from "~/ui/seed-state-finder/VoiceLineSearch";

export function useStateSearch(
  isActive: boolean,
): [(voiceLines: VoiceLineKey[]) => Promise<SearchActionResult>, () => void] {
  const settings = useSettings();
  const [rng, updateRng] = useMutableRng();

  const [t] = useTranslation();

  const findStateWorkerRef = useRef<FindStateController>(null);

  const findStateWorkerPromiseRef =
    useRef<PromiseWithResolvers<SearchActionResult>>(null);

  const findStateWorkerOnMessageEffectEvent = useEffectEvent(
    ({ data }: MessageEvent<ResultType<FindStateController>>): void => {
      if (!findStateWorkerPromiseRef.current) {
        throw new Error(
          "Find State Controller must not yield results without " +
            "findStateWorkerPromiseRef being set",
        );
      }

      if (!rng) {
        throw new Error(
          "Find State Controller must not yield results without rng being set",
        );
      }

      if (data.type !== "terminalResult") {
        return;
      }

      if (!data.result) {
        findStateWorkerPromiseRef.current.resolve({
          searchResult: "failure",
          voiceLinesAction: "clearAndBackup",
        });
        return;
      }

      const nextRng = new MtRand(data.result);

      updateRng({ type: "snapshotBackupRng" });
      updateRng({ type: "setRng", rng: nextRng });

      findStateWorkerPromiseRef.current.resolve({
        searchResult: "success",
        nextSearchResultStatusText: t(
          ($) => $.seedStateFinder.statesAdvancedLabel,
          {
            states: nextRng.stateIndex - rng.stateIndex,
          },
        ),
        voiceLinesAction: "clearAndBackup",
      });
    },
  );

  useEffect(() => {
    if (!isActive) {
      return;
    }

    findStateWorkerRef.current = createFindStateController();

    findStateWorkerRef.current.onmessage = findStateWorkerOnMessageEffectEvent;

    return () => {
      findStateWorkerRef.current?.terminate();
      findStateWorkerRef.current = null;
    };
  }, [isActive]);

  // State setting is deferred in here since it is passed to a transition
  function doStateSearchAction(
    voiceLines: VoiceLineKey[],
  ): Promise<SearchActionResult> {
    if (!rng) {
      throw new Error("Cannot start State Search without rng being set");
    }

    findStateWorkerPromiseRef.current = new PromiseWithResolvers();

    findStateWorkerRef.current?.postMessage({
      type: "start",
      rng: rng.getRngCopy().deconstruct(),
      searchDepth: settings["advanced.stateFinder.searchDepth"],
      targetSequence: voiceLines,
    });

    return findStateWorkerPromiseRef.current.promise;
  }

  function handleCancelStateSearch(): void {
    findStateWorkerRef.current?.postMessage({ type: "stop" });
    if (!findStateWorkerPromiseRef.current) {
      throw new Error(
        "Find State Controller must not be canceled without " +
          "findStateWorkerPromiseRef being set",
      );
    }

    findStateWorkerPromiseRef.current.resolve({
      searchResult: "canceled",
    });
  }

  return [doStateSearchAction, handleCancelStateSearch];
}
