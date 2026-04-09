import type { Except } from "type-fest";
import { MtRand, type DeconstructedMtRand } from "~/common/util/mt-rand";

type DeconstructedMtRandWithRawStateArray = Except<
  DeconstructedMtRand,
  "state"
> & {
  readonly state: number[];
};

function toRawStateArray(
  rng: DeconstructedMtRand,
): DeconstructedMtRandWithRawStateArray {
  return {
    ...rng,
    state: [...rng.state],
  };
}

function fromRawStateArray(
  rng: DeconstructedMtRandWithRawStateArray,
): DeconstructedMtRand {
  return {
    ...rng,
    state: Uint32Array.from(rng.state),
  };
}

export interface DeconstructedMtRandView {
  readonly rng: DeconstructedMtRandWithRawStateArray;
  readonly keyframe: DeconstructedMtRandWithRawStateArray;
  readonly backupRng: DeconstructedMtRandWithRawStateArray | null;
  readonly backupKeyframe: DeconstructedMtRandWithRawStateArray | null;
}

export class MtRandView {
  readonly #rng: MtRand;
  readonly #keyframe: MtRand;
  readonly #backupRng: MtRand | undefined;
  readonly #backupKeyframe: MtRand | undefined;

  static from(deconstructed: DeconstructedMtRandView): MtRandView {
    return new MtRandView(
      new MtRand(fromRawStateArray(deconstructed.rng)),
      new MtRand(fromRawStateArray(deconstructed.keyframe)),
      deconstructed.backupRng
        ? new MtRand(fromRawStateArray(deconstructed.backupRng))
        : undefined,
      deconstructed.backupKeyframe
        ? new MtRand(fromRawStateArray(deconstructed.backupKeyframe))
        : undefined,
    );
  }

  constructor(
    rng: MtRand,
    keyframe: MtRand,
    backupRng: MtRand | undefined,
    backupKeyframe: MtRand | undefined,
  ) {
    this.#rng = rng;
    this.#keyframe = keyframe;
    this.#backupRng = backupRng;
    this.#backupKeyframe = backupKeyframe;
  }

  deconstruct(): DeconstructedMtRandView {
    return {
      rng: toRawStateArray(this.#rng.deconstruct()),
      keyframe: toRawStateArray(this.#keyframe.deconstruct()),
      backupRng: this.#backupRng
        ? toRawStateArray(this.#backupRng.deconstruct())
        : null,
      backupKeyframe: this.#backupKeyframe
        ? toRawStateArray(this.#backupKeyframe.deconstruct())
        : null,
    };
  }

  get seed(): number {
    return this.#rng.seed;
  }

  get stateIndex(): number {
    return this.#rng.stateIndex;
  }

  get minimumGoToStateIndex(): number {
    return this.#keyframe.stateIndex;
  }

  get backupStateIndex(): number | undefined {
    return this.#backupRng?.stateIndex;
  }

  getRngCopy(): MtRand {
    return this.#rng.copy();
  }

  getKeyframeCopy(): MtRand {
    return this.#keyframe.copy();
  }

  getBackupRngCopy(): MtRand | undefined {
    return this.#backupRng?.copy();
  }

  getBackupKeyframeCopy(): MtRand | undefined {
    return this.#backupKeyframe?.copy();
  }
}
