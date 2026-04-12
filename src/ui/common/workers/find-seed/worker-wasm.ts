import type { DeconstructedMtRand as WasmDeconstructedMtRand } from "~/../wasm-rs/pkg/wasm_rs";
import init, { find_seed } from "~/../wasm-rs/pkg/wasm_rs";
import wasmPath from "~/../wasm-rs/pkg/wasm_rs_bg.wasm?url";
import type { DeconstructedMtRand } from "~/common/util/mt-rand";
import type { FindSeedWorker } from "~/ui/common/workers/find-seed/find-seed.types";
import type {
  CommandType,
  ResultType,
} from "~/ui/common/workers/workers.types";

const initTask = init({ module_or_path: wasmPath });

function convertToTs(
  wasmRng: WasmDeconstructedMtRand | undefined,
): DeconstructedMtRand | null {
  if (wasmRng === undefined) {
    return null;
  }

  return {
    seed: wasmRng.seed,
    state: wasmRng.state,
    countdown: wasmRng.countdown,
    indexNext: wasmRng.index_next,
    twists: wasmRng.twists,
  };
}

onmessage = async ({
  data,
}: MessageEvent<CommandType<FindSeedWorker>>): Promise<void> => {
  await initTask;

  const result = convertToTs(
    find_seed(
      data.seedEstimate,
      data.seedOffset,
      data.seedIncrement,
      data.startState,
      data.searchDepth,
      Uint32Array.from(data.targetSequence),
      data.targetSequenceHash,
    ),
  );

  postMessage({
    type: "terminalResult",
    result,
  } satisfies ResultType<FindSeedWorker>);
};
