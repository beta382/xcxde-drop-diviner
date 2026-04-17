import type {
  CommandType,
  ResultSubtype,
  TypedWorker,
} from "~/ui/common/workers/workers.types";

export class WorkerController<
  ChildCommandT,
  ChildIntermediateResultT,
  ChildTerminalResultT,
  ControllerIntermediateResultT,
  ControllerTerminalResultT,
  ChildWorkerT extends TypedWorker<
    ChildCommandT,
    ChildIntermediateResultT,
    ChildTerminalResultT
  > = TypedWorker<
    ChildCommandT,
    ChildIntermediateResultT,
    ChildTerminalResultT
  >,
  ControllerWorkerT extends TypedWorker<
    unknown,
    ControllerIntermediateResultT,
    ControllerTerminalResultT
  > = TypedWorker<
    unknown,
    ControllerIntermediateResultT,
    ControllerTerminalResultT
  >,
> {
  readonly #children: {
    worker: ChildWorkerT;
    isActive: boolean;
    progress: number;
  }[];
  readonly #postProgressPeriod: number;
  #prevTotalProgress = 0;
  #shouldReportSuccess = false;

  constructor(
    numWorkers: number,
    postProgressPeriod: number,
    workerSpawner: () => ChildWorkerT,
    mapIntermediateResult: (
      result: ChildIntermediateResultT,
    ) => ControllerIntermediateResultT,
    mapTerminalResult: (
      result: ChildTerminalResultT,
    ) => ControllerTerminalResultT,
  ) {
    this.#children = Array.from({ length: numWorkers }).map(() => ({
      worker: workerSpawner(),
      isActive: false,
      progress: 0,
    }));
    this.#postProgressPeriod = postProgressPeriod;

    for (const child of this.#children) {
      child.worker.onmessage = ({ data }) => {
        switch (data.type) {
          case "progress":
            child.progress = data.progress;
            this.#maybePostProgress();
            return;
          case "intermediateResult":
            this.#postIntermediateResult(mapIntermediateResult(data.result));
            return;
          case "terminalResult":
            if (data.result !== undefined && data.result !== null) {
              this.#postTerminalResult(mapTerminalResult(data.result));
              this.stopWorkers();
            } else {
              child.isActive = false;
              // Any success = report success
              this.#shouldReportSuccess ||= data.result === undefined;

              if (!this.#children.find(({ isActive }) => isActive)) {
                this.#postTerminalResult(
                  this.#shouldReportSuccess ? undefined : null,
                );
              }

              child.worker.terminate();
            }

            return;
          default:
            return data satisfies never;
        }
      };
    }
  }

  startWorkers(cmd: (childIndex: number) => CommandType<ChildWorkerT>): void {
    this.#children.forEach((child, i) => {
      child.isActive = true;
      child.worker.postMessage(cmd(i));
    });
  }

  stopWorkers(): void {
    this.#children.forEach((child) => {
      child.isActive = false;
      child.worker.terminate();
    });
  }

  #maybePostProgress(): void {
    const totalProgress =
      this.#children.reduce((acc, child) => acc + child.progress, 0) /
      this.#children.length;
    if (totalProgress >= this.#prevTotalProgress + this.#postProgressPeriod) {
      postMessage({
        type: "progress",
        progress: totalProgress,
      } satisfies ResultSubtype<ControllerWorkerT, "progress">);

      this.#prevTotalProgress = totalProgress;
    }
  }

  #postIntermediateResult(result: ControllerIntermediateResultT): void {
    postMessage({
      type: "intermediateResult",
      result,
    } satisfies ResultSubtype<ControllerWorkerT, "intermediateResult">);
  }

  #postTerminalResult(
    result: ControllerTerminalResultT | undefined | null,
  ): void {
    postMessage({ type: "terminalResult", result } satisfies ResultSubtype<
      ControllerWorkerT,
      "terminalResult"
    >);
  }
}
