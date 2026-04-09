import { useEffect, useReducer, type ReactNode } from "react";
import { MtRand } from "~/common/util/mt-rand";
import { MAX_RNG_KEYFRAME_OFFSET } from "~/ui/common";
import { MtRandView } from "~/ui/common/contexts/rng/mt-rand-view";
import {
  RngContext,
  type RngUpdate,
} from "~/ui/common/contexts/rng/rng-context";
import { useMutableSettings } from "~/ui/common/contexts/settings/settings-context";

function reducer(
  prevRng: MtRandView | undefined,
  action: RngUpdate,
): MtRandView | undefined {
  switch (action.type) {
    case "reset":
      return undefined;
    case "prevState": {
      if (prevRng === undefined) {
        return undefined;
      }

      const nextRng = prevRng.getKeyframeCopy();
      if (prevRng.stateIndex > prevRng.minimumGoToStateIndex) {
        nextRng.goTo(prevRng.stateIndex - 1);
      }

      return new MtRandView(
        nextRng,
        prevRng.getKeyframeCopy(),
        prevRng.getBackupRngCopy(),
        prevRng.getBackupKeyframeCopy(),
      );
    }
    case "nextState": {
      if (prevRng === undefined) {
        return undefined;
      }

      const nextRng = prevRng.getRngCopy();
      nextRng.advance(1);

      const nextKeyframe = prevRng.getKeyframeCopy();
      const minKeyframeState = nextRng.stateIndex - MAX_RNG_KEYFRAME_OFFSET;
      if (nextKeyframe.stateIndex < minKeyframeState) {
        nextKeyframe.goTo(minKeyframeState);
      }

      return new MtRandView(
        nextRng,
        nextKeyframe,
        prevRng.getBackupRngCopy(),
        prevRng.getBackupKeyframeCopy(),
      );
    }
    case "snapshotBackupRng": {
      if (prevRng === undefined) {
        return undefined;
      }

      return new MtRandView(
        prevRng.getRngCopy(),
        prevRng.getKeyframeCopy(),
        prevRng.getRngCopy(),
        prevRng.getKeyframeCopy(),
      );
    }
    case "restoreBackupRng": {
      if (prevRng === undefined) {
        return undefined;
      }

      const nextRng = prevRng.getBackupRngCopy();
      const nextKeyframe = prevRng.getBackupKeyframeCopy();

      if (nextRng === undefined || nextKeyframe === undefined) {
        return prevRng;
      }

      return new MtRandView(nextRng, nextKeyframe, undefined, undefined);
    }
    case "setSeedAndResetState": {
      const nextSeed = action.value;
      if (prevRng?.seed === nextSeed) {
        return prevRng;
      }

      const rng = new MtRand(nextSeed);
      return new MtRandView(rng, rng, undefined, undefined);
    }
    case "setState": {
      if (prevRng === undefined) {
        return undefined;
      }

      const nextState = action.value;

      if (prevRng.stateIndex === nextState) {
        return prevRng;
      }

      const nextKeyframe = prevRng.getKeyframeCopy();
      nextKeyframe.goTo(Math.max(0, nextState - MAX_RNG_KEYFRAME_OFFSET));

      const nextRng = nextKeyframe.copy();
      nextRng.goTo(nextState);

      return new MtRandView(
        nextRng,
        nextKeyframe,
        prevRng.getBackupRngCopy(),
        prevRng.getBackupKeyframeCopy(),
      );
    }
    case "setRng":
      if (
        prevRng?.seed === action.rng.seed &&
        prevRng.stateIndex === action.rng.stateIndex
      ) {
        return prevRng;
      }

      return new MtRandView(
        action.rng,
        action.keyframe ?? action.rng,
        prevRng?.getBackupRngCopy(),
        prevRng?.getBackupKeyframeCopy(),
      );
    default:
      return action satisfies never;
  }
}

export function RngProvider({ children }: { children: ReactNode }) {
  const [settings, updateSettings] = useMutableSettings();
  const [rng, dispatch] = useReducer(
    reducer,
    settings["hidden.rng"]
      ? MtRandView.from(settings["hidden.rng"])
      : undefined,
  );

  useEffect(() => {
    updateSettings({ "hidden.rng": rng?.deconstruct() ?? null });
  }, [rng, updateSettings]);

  return <RngContext value={{ rng, dispatch }}>{children}</RngContext>;
}
