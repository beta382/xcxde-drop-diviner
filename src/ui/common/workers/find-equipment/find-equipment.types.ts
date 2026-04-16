import type { Except } from "type-fest";
import type { DeconstructedMtRand } from "~/common/util/mt-rand";
import type {
  TypedWorker,
  WorkerControllerType,
} from "~/ui/common/workers/workers.types";

export type FindEquipmentController = WorkerControllerType<
  FindEquipmentControllerCommand,
  FindEquipmentControllerResult,
  never
>;

export type FindEquipmentWorker = TypedWorker<
  FindEquipmentWorkerCommand,
  FindEquipmentWorkerResult,
  never
>;

export interface FindEquipmentControllerCommand {
  rng: DeconstructedMtRand;
  exactMatch: boolean;
  searchDepth: number;
  threads: number;
  progressNotifyPeriod: number;
  enemy: {
    id: number;
    level: number;
    brokenAppendages: number[];
  };
  equipmentFilters: {
    key: number;
    id: number;
    traits: { id: number; domain: "ground" | "skell" }[];
    augmentSlots: number;
  }[];
  treasureSensor: number;
  crossClassId: number;
}

export type FindEquipmentWorkerCommand = Except<
  FindEquipmentControllerCommand,
  "threads"
> & {
  stateOffset: number;
  stateIncrement: number;
};

export interface FindEquipmentControllerResult {
  equipmentFilterIndex: number;
  stateIndex: number;
  offsetIndex: number;
}

export type FindEquipmentWorkerResult = FindEquipmentControllerResult;
