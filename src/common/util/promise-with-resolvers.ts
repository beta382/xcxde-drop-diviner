/**
 * A stand-in for Promise.withResolvers() while it's not yet Baseline Widely
 * Available.
 */
export class PromiseWithResolvers<T> {
  readonly promise: Promise<T>;
  #resolve: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[0] =
    () => {};
  #reject: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[1] =
    () => {};

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  get resolve() {
    return this.#resolve;
  }

  get reject() {
    return this.#reject;
  }
}
