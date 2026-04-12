import type { DeconstructedMtRand } from "~/common/util/mt-rand";
import type { TypedWorker } from "~/ui/common/workers/workers.types";

export type LongStateAdvanceWorker = TypedWorker<
  LongStateAdvanceWorkerCommand,
  never,
  LongStateAdvanceResult
>;

export interface LongStateAdvanceWorkerCommand {
  rng: DeconstructedMtRand;
  targetState: number;
}

export interface LongStateAdvanceResult {
  rng: DeconstructedMtRand;
  keyframe: DeconstructedMtRand;
}
