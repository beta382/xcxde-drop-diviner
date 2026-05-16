import { expect, test } from "vitest";
import { PromiseWithResolvers } from "~/common/util/promise-with-resolvers";

test("PromiseWithResolvers resolves", async () => {
  const expected = "test";

  const promise = new PromiseWithResolvers();
  promise.resolve(expected);

  await expect(promise.promise).resolves.toBe(expected);
});

test("PromiseWithResolvers rejects", async () => {
  const expected = "test";

  const promise = new PromiseWithResolvers();
  promise.reject(expected);

  await expect(promise.promise).rejects.toThrow(expected);
});
