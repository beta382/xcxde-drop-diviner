const N = 624;
const M = 397;
const F = 1812433253;

export interface DeconstructedMtRand {
  readonly seed: number;
  readonly state: Uint32Array;
  readonly countdown: number;
  readonly indexNext: number;
  readonly twists: number;
}

export class MtRand {
  readonly seed: number;
  #state = new Uint32Array(N);
  #countdown = 1;
  #indexNext = 0;
  #twists = 0;

  /**
   * Constructs an MtRand.
   *
   * @param arg Either the Seed, or a Deconstructed instance to reconstruct
   */
  constructor(arg: number | DeconstructedMtRand) {
    if (typeof arg === "number") {
      this.seed = arg;
      this.#srand(arg);
    } else {
      this.seed = arg.seed;
      this.#state = new Uint32Array(arg.state);
      this.#countdown = arg.countdown;
      this.#indexNext = arg.indexNext;
      this.#twists = arg.twists;
    }
  }

  copy(): MtRand {
    return new MtRand(this.deconstruct());
  }

  deconstruct(): DeconstructedMtRand {
    return {
      seed: this.seed,
      state: new Uint32Array(this.#state),
      countdown: this.#countdown,
      indexNext: this.#indexNext,
      twists: this.#twists,
    };
  }

  get stateIndex(): number {
    return this.#twists === 0 ? 0 : (this.#twists - 1) * N + this.#indexNext;
  }
  /**
   * Generates a random boolean according to the given true probability.
   *
   * @param probability The chance of returning true in percentage points,
   *   effectively clamped to [0, 100]
   * @returns A random boolean
   */
  randBoolean(probability: number): boolean {
    return probability > this.randInt(100);
  }

  /**
   * Generates a random integer in [0, max).
   *
   * @param max The maximum value, exclusive, UB if not in [1, 2^31]
   * @returns A random integer
   */
  randInt(max: number = 2 ** 31): number {
    return this.#rand31() % max;
  }

  /**
   * Generates a random integer in [0, 2^pow).
   *
   * @param pow The maximum value power, exclusive, UB if not in [1, 31]
   * @returns A random integer
   */
  randIntPow2(pow: number = 31): number {
    return this.#rand31() & ((1 << pow) - 1);
  }

  /**
   * Generates a random integer in [min, max).
   *
   * @param min The minimum value, inclusive, UB if not in [0, 2^31 - 1]
   * @param max The maximum value, exclusive, UB if not in [min + 1, 2^31]
   * @returns A random integer
   */
  randRange(min: number, max: number): number {
    return (this.#rand31() % (max - min)) + min;
  }

  /**
   * Advance forward the given number of states.
   *
   * @param count The number of states to advance by
   */
  advance(count: number): void {
    while (count >= this.#countdown) {
      count -= this.#countdown;
      this.#nextMt();
      this.#indexNext++;
    }

    this.#indexNext += count;
    this.#countdown -= count;
  }

  /**
   * Go directly to the given state.
   *
   * @param stateIndex The target state
   */
  goTo(stateIndex: number) {
    const currentStateIndex = this.stateIndex;

    if (currentStateIndex < stateIndex) {
      this.advance(stateIndex - currentStateIndex);
    } else if (currentStateIndex > stateIndex) {
      this.#reset();
      this.advance(stateIndex);
    }
  }

  #srand(seed: number): void {
    this.#state[0] = seed;
    for (let i = 1; i < N; i++) {
      seed = (Math.imul(F, seed ^ (seed >>> 30)) + i) & 0xffffffff;
      this.#state[i] = seed;
    }
  }

  #nextMt(): void {
    this.#indexNext = 0;
    this.#countdown = N;
    this.#twists++;

    for (let i = 0; i < N; i++) {
      const x =
        (this.#state[i] & 0x80000000) |
        (this.#state[i === N - 1 ? 0 : i + 1] & 0x7fffffff);
      let xA = x >>> 1;
      if (x & 1) {
        xA ^= 0x9908b0df;
      }

      this.#state[i] = this.#state[i >= N - M ? i - (N - M) : i + M] ^ xA;
    }
  }

  #rand31(): number {
    if (--this.#countdown < 1) {
      this.#nextMt();
    }

    let y = this.#state[this.#indexNext++];

    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 1;
  }

  #reset(): void {
    this.#srand(this.seed);
    this.#countdown = 1;
    this.#indexNext = 0;
    this.#twists = 0;
  }
}
