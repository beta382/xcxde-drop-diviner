import type { DeconstructedMtRand } from "~/common/util/mt-rand";
import type {
  TypedWorker,
  WorkerControllerType,
} from "~/ui/common/workers/workers.types";
import type { VoiceLineKey } from "~/ui/seed-state-finder/voice-lines";

export type SearchSeedFileController = WorkerControllerType<
  SearchSeedFileControllerCommand,
  never,
  SearchSeedFileControllerResult
>;

export type SearchSeedFileWorker = TypedWorker<
  SearchSeedFileWorkerCommand,
  never,
  SearchSeedFileWorkerResult
>;

export interface SearchSeedFileControllerCommand {
  seedFile: File;
  targetSequence: VoiceLineKey[];
}

export interface SearchSeedFileWorkerCommand {
  seedFile: File;
  targetSequence: number[];
}

export type SearchSeedFileControllerResult = DeconstructedMtRand;

export type SearchSeedFileWorkerResult = SearchSeedFileControllerResult;
