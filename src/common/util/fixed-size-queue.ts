export class FixedSizeQueue<T> {
  readonly #array: T[];
  #offset = 0;
  readonly length: number;

  /**
   * Constructs a FixedSizeQueue with the given size, initially empty.
   *
   * @param size The size
   */
  constructor(size: number) {
    if (size < 1) {
      throw new RangeError("size must be 1 or more");
    }

    this.#array = new Array<T>(size);
    this.length = size;
  }

  /**
   * Constructs a FixedSizeQueue from the given array.
   *
   * @param array The array
   * @returns The FixedSizeQueue
   */
  static of<T>(array: T[]): FixedSizeQueue<T> {
    const queue = new FixedSizeQueue<T>(array.length);
    for (const element of array) {
      queue.shiftAndPush(element);
    }

    return queue;
  }

  /** A shallow copy of the logical backing array. */
  get array(): T[] {
    const array = new Array<T>(this.length);
    for (let i = 0; i < this.length; i++) {
      array[i] = this.#array[(this.#offset + i) % this.length];
    }

    return array;
  }

  /**
   * Removes the first element of the queue and adds the specified element to
   * the end of the queue.
   *
   * @param element The element to add to the end of the queue
   * @returns The element removed from the front of the queue, UB if the queue
   *   is not yet full
   */
  shiftAndPush(element: T): T {
    const oldElement = this.#array[this.#offset];
    this.#array[this.#offset] = element;

    this.#offset++;
    if (this.#offset >= this.length) {
      this.#offset -= this.length;
    }

    return oldElement;
  }
}
