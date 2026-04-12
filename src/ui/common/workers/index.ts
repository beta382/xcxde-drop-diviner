import type { FindSeedController } from "~/ui/common/workers/find-seed/find-seed.types";
import type { FindStateController } from "~/ui/common/workers/find-state/find-state.types";
import type { LongStateAdvanceWorker } from "~/ui/common/workers/long-state-advance/long-state-advance.types";

export function createFindSeedController(): FindSeedController {
  return new Worker(new URL("./find-seed/controller.ts", import.meta.url), {
    type: "module",
  }) as FindSeedController;
}

export function createFindStateController(): FindStateController {
  return new Worker(new URL("./find-state/controller.ts", import.meta.url), {
    type: "module",
  }) as FindStateController;
}

export function createLongStateAdvanceWorker(): LongStateAdvanceWorker {
  return new Worker(
    new URL("./long-state-advance/worker.ts", import.meta.url),
    { type: "module" },
  ) as LongStateAdvanceWorker;
}
