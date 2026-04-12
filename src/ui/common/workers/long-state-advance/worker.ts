import { MtRand } from "~/common/util/mt-rand";
import { MAX_RNG_KEYFRAME_OFFSET } from "~/ui/common";
import type {
  LongStateAdvanceWorker,
  LongStateAdvanceWorkerCommand,
} from "~/ui/common/workers/long-state-advance/long-state-advance.types";
import type {
  CommandType,
  ResultType,
} from "~/ui/common/workers/workers.types";

function advanceState(
  cmd: LongStateAdvanceWorkerCommand,
): ResultType<LongStateAdvanceWorker> {
  const keyframe = new MtRand(cmd.rng);
  keyframe.goTo(Math.max(0, cmd.targetState - MAX_RNG_KEYFRAME_OFFSET));

  const rng = keyframe.copy();
  rng.goTo(cmd.targetState);

  return {
    type: "terminalResult",
    result: { rng: rng.deconstruct(), keyframe: keyframe.deconstruct() },
  };
}

onmessage = ({
  data,
}: MessageEvent<CommandType<LongStateAdvanceWorker>>): void => {
  postMessage(advanceState(data));
};
