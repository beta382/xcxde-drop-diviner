import { createSequenceHash } from "~/common/util/rng-state-search";
import type {
  FindSeedController,
  FindSeedControllerResult,
  FindSeedWorker,
  FindSeedWorkerCommand,
  FindSeedWorkerResult,
} from "~/ui/common/workers/find-seed/find-seed.types";
import { WorkerController } from "~/ui/common/workers/worker-controller";
import type { CommandType } from "~/ui/common/workers/workers.types";
import { indexForVoiceLineKey } from "~/ui/seed-state-finder/voice-lines";

let controller:
  | WorkerController<
      FindSeedWorkerCommand,
      never,
      FindSeedWorkerResult,
      never,
      FindSeedControllerResult
    >
  | undefined = undefined;
onmessage = ({ data }: MessageEvent<CommandType<FindSeedController>>): void => {
  switch (data.type) {
    case "start": {
      if (controller) {
        controller.stopWorkers();
      }

      const targetSequence = data.targetSequence.map(
        (voiceLine) => indexForVoiceLineKey[voiceLine.element],
      );
      const targetSequenceHash = createSequenceHash(targetSequence);

      controller = new WorkerController(
        data.threads,
        1,
        () => {
          switch (data.workerType) {
            case "ts":
              return new Worker(new URL("./worker-ts.ts", import.meta.url), {
                type: "module",
              }) as FindSeedWorker;
            case "wasm":
              return new Worker(new URL("./worker-wasm.ts", import.meta.url), {
                type: "module",
              }) as FindSeedWorker;
            default:
              return data.workerType satisfies never;
          }
        },
        () => {},
        (rng) => rng,
      );

      controller.startWorkers((i) => ({
        seedEstimate: data.seedEstimate,
        seedOffset: i,
        seedIncrement: data.threads,
        startState: data.startState,
        searchDepth: data.searchDepth,
        targetSequence,
        targetSequenceHash,
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
