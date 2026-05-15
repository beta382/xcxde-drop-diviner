import type {
  SearchSeedFileController,
  SearchSeedFileControllerResult,
  SearchSeedFileWorker,
  SearchSeedFileWorkerCommand,
  SearchSeedFileWorkerResult,
} from "~/ui/common/workers/search-seed-file/search-seed-file.types";
import { WorkerController } from "~/ui/common/workers/worker-controller";
import type { CommandType } from "~/ui/common/workers/workers.types";
import { indexForVoiceLineKey } from "~/ui/seed-state-finder/voice-lines";

let controller:
  | WorkerController<
      SearchSeedFileWorkerCommand,
      never,
      SearchSeedFileWorkerResult,
      never,
      SearchSeedFileControllerResult
    >
  | undefined = undefined;

onmessage = ({ data }: MessageEvent<CommandType<SearchSeedFileController>>) => {
  switch (data.type) {
    case "start": {
      if (controller) {
        controller.stopWorkers();
      }

      const targetSequence = data.targetSequence.map(
        (voiceLine) => indexForVoiceLineKey[voiceLine],
      );

      controller = new WorkerController(
        1,
        1,
        () =>
          new Worker(new URL("./worker.ts", import.meta.url), {
            type: "module",
          }) as SearchSeedFileWorker,
        () => {},
        (rng) => rng,
      );

      controller.startWorkers(() => ({
        seedFile: data.seedFile,
        targetSequence,
      }));
      return;
    }
    case "stop":
      if (controller) {
        controller.stopWorkers();
        controller = undefined;
      }
      return;
    default:
      return data satisfies never;
  }
};
