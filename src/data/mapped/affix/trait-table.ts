import type { MtRand } from "~/common/util/mt-rand";
import { groundAffixes, skellAffixes } from "~/data/mapped/affix";
import type { Affix } from "~/data/mapped/affix/affix";

export interface TraitProbability {
  readonly trait: Affix;
  readonly traitId: number;
  readonly probability: number;
}

/** Represents possible traits a piece of gear can receive. */
export class TraitTable {
  readonly #traitProbabilities: TraitProbability[];

  constructor(traitProbabilities: TraitProbability[]) {
    this.#traitProbabilities = traitProbabilities;
  }

  /** The traits in this trait table. */
  get traits(): Affix[] {
    return this.#traitProbabilities.map(
      (traitProbability) => traitProbability.trait,
    );
  }

  /** The trait probabilities in this trait table */
  get traitProbabilities(): TraitProbability[] {
    return [...this.#traitProbabilities];
  }

  /**
   * Rolls a trait given a set of already-picked traits that cannot be chosen
   * again.
   *
   * @param rng The RNG engine
   * @param pickedTraits The set of already-picked traits, which is mutated to
   *   include the newly-picked trait
   * @returns The trait
   */
  rollTrait(rng: MtRand, pickedTraits: Set<number>): Affix {
    while (true) {
      for (let i = 0; i < this.#traitProbabilities.length; i++) {
        const traitProbability = this.#traitProbabilities[i];
        if (pickedTraits.has(traitProbability.traitId)) {
          continue;
        }

        if (rng.randBoolean(traitProbability.probability)) {
          pickedTraits.add(traitProbability.traitId);
          return traitProbability.trait;
        }
      }
    }
  }
}

export function getAffixForTraitTableRow(
  traitTableId: number,
  affixId: number,
): Affix | null {
  if (affixId === 0) {
    return null;
  }

  return traitTableId <= 1584 ? groundAffixes[affixId] : skellAffixes[affixId];
}
