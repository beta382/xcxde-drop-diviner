import { MtRand } from "~/common/util/mt-rand";
import { searchRngForSequence } from "~/common/util/rng-state-search";
import type {
  FindStateWorker,
  FindStateWorkerCommand,
  FindStateWorkerResult,
} from "~/ui/common/workers/find-state/find-state.types";
import type {
  CommandType,
  ResultType,
} from "~/ui/common/workers/workers.types";

function findState(cmd: FindStateWorkerCommand): FindStateWorkerResult | null {
  const rng = new MtRand(cmd.rng);

  const sequenceFound = searchRngForSequence(
    rng,
    cmd.searchDepth,
    (rng) => rng.randIntPow2(3),
    cmd.targetSequence,
    cmd.targetSequenceHash,
  );

  if (sequenceFound) {
    return rng.deconstruct();
  }

  return null;
}

onmessage = ({ data }: MessageEvent<CommandType<FindStateWorker>>): void => {
  postMessage({
    type: "terminalResult",
    result: findState(data),
  } satisfies ResultType<FindStateWorker>);
};
