import { useEffect, useEffectEvent, useRef } from "react";
import { MtRand } from "~/common/util/mt-rand";
import { PromiseWithResolvers } from "~/common/util/promise-with-resolvers";
import { useMutableRng } from "~/ui/common/contexts/rng/rng-context";
import { createSearchSeedFileController } from "~/ui/common/workers";
import type { SearchSeedFileController } from "~/ui/common/workers/search-seed-file/search-seed-file.types";
import type { ResultType } from "~/ui/common/workers/workers.types";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";
import type { SearchActionResult } from "~/ui/seed-state-finder/VoiceLineSearch";

export function useSeedFileSearch(
  isActive: boolean,
  file: File | undefined,
): [(voiceLines: VoiceLineKey[]) => Promise<SearchActionResult>, () => void] {
  const [, updateRng] = useMutableRng();

  const searchSeedFileWorkerRef = useRef<SearchSeedFileController>(null);

  const searchSeedFileWorkerPromiseRef =
    useRef<PromiseWithResolvers<SearchActionResult>>(null);

  const searchSeedFileWorkerOnMessageEffectEvent = useEffectEvent(
    ({ data }: MessageEvent<ResultType<SearchSeedFileController>>): void => {
      if (!searchSeedFileWorkerPromiseRef.current) {
        throw new Error(
          "Search Seed File Controller must not yield results without " +
            "searchSeedFileWorkerPromiseRef being set",
        );
      }

      if (data.type !== "terminalResult") {
        return;
      }

      if (!data.result) {
        searchSeedFileWorkerPromiseRef.current.resolve({
          searchResult: "failure",
        });
        return;
      }

      updateRng({ type: "setRng", rng: new MtRand(data.result) });

      searchSeedFileWorkerPromiseRef.current.resolve({
        searchResult: "success",
        voiceLinesAction: "clear",
      });
    },
  );

  useEffect(() => {
    if (!isActive) {
      return;
    }

    searchSeedFileWorkerRef.current = createSearchSeedFileController();

    searchSeedFileWorkerRef.current.onmessage =
      searchSeedFileWorkerOnMessageEffectEvent;

    return () => {
      searchSeedFileWorkerRef.current?.terminate();
      searchSeedFileWorkerRef.current = null;
    };
  }, [isActive]);

  function doSeedFileSearchAction(
    voiceLines: VoiceLineKey[],
  ): Promise<SearchActionResult> {
    if (!file) {
      throw new Error("Cannot start Seed File Search with no file");
    }

    searchSeedFileWorkerPromiseRef.current = new PromiseWithResolvers();

    searchSeedFileWorkerRef.current?.postMessage({
      type: "start",
      seedFile: file,
      targetSequence: voiceLines,
    });

    return searchSeedFileWorkerPromiseRef.current.promise;
  }

  function handleCancelSeedFileSearch(): void {
    searchSeedFileWorkerRef.current?.postMessage({ type: "stop" });
    if (!searchSeedFileWorkerPromiseRef.current) {
      throw new Error(
        "Search Seed File Controller must not be canceled without " +
          "searchSeedFileWorkerPromiseRef being set",
      );
    }

    searchSeedFileWorkerPromiseRef.current.resolve({
      searchResult: "canceled",
    });
  }

  return [doSeedFileSearchAction, handleCancelSeedFileSearch];
}
