import type { Except, ExtractStrict } from "type-fest";

type WorkerTypeArgs<WorkerT> =
  WorkerT extends TypedWorker<
    infer CommandT,
    infer IntermediateResultT,
    infer TerminalResultT
  >
    ? [CommandT, IntermediateResultT, TerminalResultT]
    : never;

export type CommandType<WorkerT> = WorkerTypeArgs<WorkerT>[0];
export type ResultType<WorkerT> =
  | { type: "progress"; progress: number }
  | {
      type: "intermediateResult";
      result: WorkerTypeArgs<WorkerT>[1];
    }
  | {
      type: "terminalResult";
      // undefined: success no data, continue children
      // null: failure no data, continue children
      // other: success, terminate children
      result: WorkerTypeArgs<WorkerT>[2] | undefined | null;
    };

export type ResultSubtype<
  WorkerT,
  ResultT extends ResultType<WorkerT>["type"],
> = ExtractStrict<ResultType<WorkerT>, { type: ResultT }>;

export type TypedWorker<CommandT, IntermediateResultT, TerminalResultT> =
  Except<Worker, "onmessage" | "postMessage"> & {
    onmessage:
      | ((
          this: TypedWorker<CommandT, IntermediateResultT, TerminalResultT>,
          ev: MessageEvent<
            ResultType<
              TypedWorker<CommandT, IntermediateResultT, TerminalResultT>
            >
          >,
        ) => void)
      | null;
    postMessage: (
      message: CommandType<
        TypedWorker<CommandT, IntermediateResultT, TerminalResultT>
      >,
      options?: WindowPostMessageOptions,
    ) => void;
  };

type StoppableCommand<CommandT> =
  | { type: "stop" }
  | ({ type: "start" } & CommandT);

export type WorkerControllerType<
  CommandT,
  IntermediateResultT,
  TerminalResultT,
> = TypedWorker<
  StoppableCommand<CommandT>,
  IntermediateResultT,
  TerminalResultT
>;
