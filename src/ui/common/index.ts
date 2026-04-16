import type { KeyedList } from "~/ui/common/common.types";

export const MAX_RNG_KEYFRAME_OFFSET = 1000;
export const CURATED_ENEMY_IDS = [
  3872, 3739, 4141, 4138, 1902, 3869, 3203, 1773, 3104, 2723, 3787, 2486, 2636,
  4132, 4122, 4118, 4126, 4134, 4109, 4115, 4120, 4130, 3770, 2061, 2572,
].sort((lhs, rhs) => lhs - rhs);

export function mergeKeyedList<T, K = number>(
  list: KeyedList<T, K>,
  nextKey: K,
  nextElement: T,
  merge: (prevElement: T, nextElement: T) => T = (prevElement) => prevElement,
): KeyedList<T, K> {
  return list.find(({ key }) => key === nextKey)
    ? list.map((prevEntry) =>
        prevEntry.key === nextKey
          ? {
              ...prevEntry,
              element: merge(prevEntry.element, nextElement),
            }
          : prevEntry,
      )
    : [
        ...list,
        {
          key: nextKey,
          element: nextElement,
        },
      ];
}
