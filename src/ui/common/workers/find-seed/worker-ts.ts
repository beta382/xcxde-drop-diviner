import { MtRand } from "~/common/util/mt-rand";
import { searchRngForSequence } from "~/common/util/rng-state-search";
import type {
  FindSeedWorker,
  FindSeedWorkerCommand,
  FindSeedWorkerResult,
} from "~/ui/common/workers/find-seed/find-seed.types";
import type {
  CommandType,
  ResultType,
} from "~/ui/common/workers/workers.types";

function findSeed(cmd: FindSeedWorkerCommand): FindSeedWorkerResult | null {
  for (
    let seedIndex = cmd.seedOffset;
    seedIndex < 2 ** 32;
    seedIndex += cmd.seedIncrement
  ) {
    const seed =
      (cmd.seedEstimate +
        (seedIndex % 2 === 0
          ? -Math.floor(seedIndex / 2)
          : Math.floor(seedIndex / 2) + 1)) >>>
      0;

    const rng = new MtRand(seed);
    rng.goTo(cmd.startState);
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
  }

  return null;
}

onmessage = ({ data }: MessageEvent<CommandType<FindSeedWorker>>): void => {
  postMessage({
    type: "terminalResult",
    result: findSeed(data),
  } satisfies ResultType<FindSeedWorker>);
};
