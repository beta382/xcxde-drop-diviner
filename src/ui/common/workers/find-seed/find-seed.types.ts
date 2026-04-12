import type { DeconstructedMtRand } from "~/common/util/mt-rand";
import type { KeyedList } from "~/ui/common/common.types";
import type {
  TypedWorker,
  WorkerControllerType,
} from "~/ui/common/workers/workers.types";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";

export type FindSeedController = WorkerControllerType<
  FindSeedControllerCommand,
  never,
  FindSeedControllerResult
>;

export type FindSeedWorker = TypedWorker<
  FindSeedWorkerCommand,
  never,
  FindSeedWorkerResult
>;

export interface FindSeedControllerCommand {
  workerType: "ts" | "wasm";
  seedEstimate: number;
  threads: number;
  startState: number;
  searchDepth: number;
  targetSequence: KeyedList<VoiceLineKey>;
}

export interface FindSeedWorkerCommand {
  seedEstimate: number;
  seedOffset: number;
  seedIncrement: number;
  startState: number;
  searchDepth: number;
  targetSequence: number[];
  targetSequenceHash: number;
}

export type FindSeedControllerResult = DeconstructedMtRand;

export type FindSeedWorkerResult = FindSeedControllerResult;
