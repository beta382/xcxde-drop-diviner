import { createContext, useContext, type Dispatch } from "react";
import type { MtRand } from "~/common/util/mt-rand";
import type { MtRandView } from "~/ui/common/contexts/rng/mt-rand-view";

export type RngUpdate =
  | {
      type:
        | "reset"
        | "prevState"
        | "nextState"
        | "snapshotBackupRng"
        | "restoreBackupRng";
    }
  | {
      type: "setSeedAndResetState" | "setState";
      value: number;
    }
  | { type: "setRng"; rng: MtRand; keyframe?: MtRand };

export const RngContext = createContext<
  { rng: MtRandView | undefined; dispatch: Dispatch<RngUpdate> } | undefined
>(undefined);

export function useMutableRng(): [MtRandView | undefined, Dispatch<RngUpdate>] {
  const rngContext = useContext(RngContext);
  if (!rngContext) {
    throw new Error(
      "useRng requires RngProvider to be higher in the component tree",
    );
  }

  return [rngContext.rng, rngContext.dispatch];
}

export function useRng(): MtRandView | undefined {
  return useMutableRng()[0];
}
