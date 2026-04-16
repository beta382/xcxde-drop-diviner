import type {
  FindEquipmentController,
  FindEquipmentControllerResult,
  FindEquipmentWorker,
  FindEquipmentWorkerCommand,
  FindEquipmentWorkerResult,
} from "~/ui/common/workers/find-equipment/find-equipment.types";
import { WorkerController } from "~/ui/common/workers/worker-controller";
import type { CommandType } from "~/ui/common/workers/workers.types";

let controller:
  | WorkerController<
      FindEquipmentWorkerCommand,
      FindEquipmentWorkerResult,
      never,
      FindEquipmentControllerResult,
      never
    >
  | undefined = undefined;
onmessage = ({
  data,
}: MessageEvent<CommandType<FindEquipmentController>>): void => {
  switch (data.type) {
    case "start":
      if (controller) {
        controller.stopWorkers();
      }

      controller = new WorkerController(
        data.threads,
        data.progressNotifyPeriod,
        () =>
          new Worker(new URL("./worker.ts", import.meta.url), {
            type: "module",
          }) as FindEquipmentWorker,
        (result) => result,
        (result) => result,
      );

      controller.startWorkers((i) => ({
        ...data,
        progressNotifyPeriod: data.progressNotifyPeriod / data.threads,
        stateOffset: i,
        stateIncrement: data.threads,
      }));

      return;
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
