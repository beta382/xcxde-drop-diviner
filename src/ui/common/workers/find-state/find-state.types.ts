import type { DeconstructedMtRand } from "~/common/util/mt-rand";
import type { KeyedList } from "~/ui/common/common.types";
import type {
  TypedWorker,
  WorkerControllerType,
} from "~/ui/common/workers/workers.types";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";

export type FindStateController = WorkerControllerType<
  FindStateControllerCommand,
  never,
  FindStateControllerResult
>;

export type FindStateWorker = TypedWorker<
  FindStateWorkerCommand,
  never,
  FindStateWorkerResult
>;

export interface FindStateControllerCommand {
  rng: DeconstructedMtRand;
  searchDepth: number;
  targetSequence: KeyedList<VoiceLineKey>;
}

export interface FindStateWorkerCommand {
  rng: DeconstructedMtRand;
  searchDepth: number;
  targetSequence: number[];
  targetSequenceHash: number;
}

export type FindStateControllerResult = DeconstructedMtRand;

export type FindStateWorkerResult = FindStateControllerResult;
