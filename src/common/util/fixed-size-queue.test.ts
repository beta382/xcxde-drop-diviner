import { expect, test } from "vitest";
import { FixedSizeQueue } from "~/common/util/fixed-size-queue";

test.each([1, 10, 100])("new FixedSizeQueue($0).length is $0", (length) => {
  const queue = new FixedSizeQueue<unknown>(length);
  expect(queue.length).toBe(length);
});

test("new FixedSizeQueue(0) throws RangeError", () => {
  expect(() => new FixedSizeQueue<unknown>(0)).toThrow(
    "size must be 1 or more",
  );
});

test.each<{ array: number[] }>([{ array: [0] }, { array: [1, 2, 3, 4, 5] }])(
  "FixedSizeQueue.of($array).length is $array.length",
  ({ array }) => {
    const queue = FixedSizeQueue.of(array);
    expect(queue.length).toBe(array.length);
  },
);

test.each<{ array: number[] }>([{ array: [0] }, { array: [1, 2, 3, 4, 5] }])(
  "FixedSizeQueue.of($array).queue equals $array",
  ({ array }) => {
    const queue = FixedSizeQueue.of(array);
    expect(queue.array).toEqual(array);
  },
);

test("FixedSizeQueue.of([]) throws RangeError", () => {
  expect(() => FixedSizeQueue.of<unknown>([])).toThrow(
    "size must be 1 or more",
  );
});

test("FixedSizeQueue.shiftAndPush() returns the removed value", () => {
  const queue = FixedSizeQueue.of([1, 2, 3, 4, 5]);

  const removed = queue.shiftAndPush(6);

  expect(removed).toBe(1);
});

test("FixedSizeQueue.shiftAndPush() results in the expected .array", () => {
  const queue = FixedSizeQueue.of([1, 2, 3, 4, 5]);

  queue.shiftAndPush(6);

  expect(queue.array).toEqual([2, 3, 4, 5, 6]);
});
