/**
 * Represents appendage chest material drop base probabilities, based on enemy
 * level range.
 */
export class ChestMaterialDropProbabilities {
  readonly #lowLevelProbability: number;
  readonly #midLevelProbability: number;
  readonly #highLevelProbability: number;

  constructor(
    lowLevelProbability: number,
    midLevelProbability: number,
    highLevelProbability: number,
  ) {
    this.#lowLevelProbability = lowLevelProbability;
    this.#midLevelProbability = midLevelProbability;
    this.#highLevelProbability = highLevelProbability;
  }

  /**
   * Gets the base probability that a material will be dropped for the given
   * enemy level.
   *
   * @param enemyLevel The enemy level
   * @returns The material drop base probability in percentage points
   */
  getProbability(enemyLevel: number): number {
    if (1 <= enemyLevel && enemyLevel <= 30) {
      return this.#lowLevelProbability;
    } else if (30 < enemyLevel && enemyLevel <= 70) {
      return this.#midLevelProbability;
    } else {
      return this.#highLevelProbability;
    }
  }
}
