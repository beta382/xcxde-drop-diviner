import { useEffect, useEffectEvent, useRef } from "react";
import { MtRand } from "~/common/util/mt-rand";
import { PromiseWithResolvers } from "~/common/util/promise-with-resolvers";
import { useMutableRng } from "~/ui/common/contexts/rng/rng-context";
import { useMutableSettings } from "~/ui/common/contexts/settings/settings-context";
import { createFindSeedController } from "~/ui/common/workers";
import type { FindSeedController } from "~/ui/common/workers/find-seed/find-seed.types";
import type { ResultType } from "~/ui/common/workers/workers.types";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";
import type { SearchActionResult } from "~/ui/seed-state-finder/VoiceLineSearch";

const USER_TIMING_ADJUSTMENT_MS_HISTORY_LENGTH = 10;

export function useSeedSearch(
  isActive: boolean,
  seedEstimateMs: number,
): [(voiceLines: VoiceLineKey[]) => Promise<SearchActionResult>, () => void] {
  const [settings, updateSettings] = useMutableSettings();
  const [, updateRng] = useMutableRng();

  const findSeedWorkerRef = useRef<FindSeedController>(null);

  const findSeedWorkerPromiseRef =
    useRef<PromiseWithResolvers<SearchActionResult>>(null);

  function msToSeed(ms: number): number {
    return (
      (settings[`advanced.seedFinder.${settings.systemType}SystemTickRateHz`] *
        (ms / 1000)) >>>
      0
    );
  }

  function seedToMs(seed: number): number {
    return (
      (seed /
        settings[
          `advanced.seedFinder.${settings.systemType}SystemTickRateHz`
        ]) *
      1000
    );
  }

  const findSeedWorkerOnMessageEffectEvent = useEffectEvent(
    ({ data }: MessageEvent<ResultType<FindSeedController>>): void => {
      if (!findSeedWorkerPromiseRef.current) {
        throw new Error(
          "Find Seed Controller must not yield results without " +
            "findSeedWorkerPromiseRef being set",
        );
      }

      if (data.type !== "terminalResult") {
        return;
      }

      if (!data.result) {
        findSeedWorkerPromiseRef.current.resolve({
          searchResult: "failure",
        });
        return;
      }

      const nextRng = new MtRand(data.result);
      updateRng({ type: "setRng", rng: nextRng });

      // Timer controls must be locked out during search
      const actualAdjustMs = seedToMs(
        (nextRng.seed - msToSeed(seedEstimateMs)) >> 0,
      );

      updateSettings({
        "advanced.seedFinder.userTimingAdjustmentMsHistory": (
          prevUserTimingAdjustmentMsHistory,
        ) =>
          [...prevUserTimingAdjustmentMsHistory, actualAdjustMs].slice(
            -USER_TIMING_ADJUSTMENT_MS_HISTORY_LENGTH,
          ),
      });

      findSeedWorkerPromiseRef.current.resolve({
        searchResult: "success",
        voiceLinesAction: "clear",
      });
    },
  );

  useEffect(() => {
    if (!isActive) {
      return;
    }

    findSeedWorkerRef.current = createFindSeedController();

    findSeedWorkerRef.current.onmessage = findSeedWorkerOnMessageEffectEvent;

    return () => {
      findSeedWorkerRef.current?.terminate();
      findSeedWorkerRef.current = null;
    };
  }, [isActive]);

  // State setting is deferred in here since it is passed to a transition
  function doSeedSearchAction(
    voiceLines: VoiceLineKey[],
  ): Promise<SearchActionResult> {
    findSeedWorkerPromiseRef.current = new PromiseWithResolvers();

    const seedTimeAdjustMs =
      settings["advanced.seedFinder.userTimingAdjustmentMsHistory"].reduce(
        (acc, ms) => acc + ms,
        0,
      ) / settings["advanced.seedFinder.userTimingAdjustmentMsHistory"].length;
    const region = settings["advanced.seedFinder.region"];

    findSeedWorkerRef.current?.postMessage({
      type: "start",
      workerType: settings["advanced.seedFinder.workerType"],
      seedEstimate: msToSeed(seedEstimateMs + seedTimeAdjustMs),
      threads:
        settings["advanced.numThreads"] === "system"
          ? navigator.hardwareConcurrency
          : settings["advanced.numThreads"],
      startState: settings[`advanced.seedFinder.${region}StartState`],
      searchDepth: settings[`advanced.seedFinder.${region}StateSearchDepth`],
      targetSequence: voiceLines,
    });

    return findSeedWorkerPromiseRef.current.promise;
  }

  function handleCancelSeedSearch(): void {
    findSeedWorkerRef.current?.postMessage({ type: "stop" });
    if (!findSeedWorkerPromiseRef.current) {
      throw new Error(
        "Find Seed Controller must not be canceled without " +
          "findSeedWorkerPromiseRef being set",
      );
    }

    findSeedWorkerPromiseRef.current.resolve({
      searchResult: "canceled",
    });
  }

  return [doSeedSearchAction, handleCancelSeedSearch];
}
