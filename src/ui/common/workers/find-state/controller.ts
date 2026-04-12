import { createSequenceHash } from "~/common/util/rng-state-search";
import type {
  FindStateController,
  FindStateControllerResult,
  FindStateWorker,
  FindStateWorkerCommand,
  FindStateWorkerResult,
} from "~/ui/common/workers/find-state/find-state.types";
import { WorkerController } from "~/ui/common/workers/worker-controller";
import type { CommandType } from "~/ui/common/workers/workers.types";
import { indexForVoiceLineKey } from "~/ui/seed-state-finder/voice-lines";

let controller:
  | WorkerController<
      FindStateWorkerCommand,
      never,
      FindStateWorkerResult,
      never,
      FindStateControllerResult
    >
  | undefined = undefined;
onmessage = ({
  data,
}: MessageEvent<CommandType<FindStateController>>): void => {
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
        1,
        1,
        () =>
          new Worker(new URL("./worker.ts", import.meta.url), {
            type: "module",
          }) as FindStateWorker,
        () => {},
        (rng) => rng,
      );

      controller.startWorkers(() => ({
        rng: data.rng,
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
