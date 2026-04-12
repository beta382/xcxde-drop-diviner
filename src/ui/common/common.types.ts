export type KeyedElement<T, K = number> = { element: T; key: K };
export type KeyedList<T, K = number> = KeyedElement<T, K>[];
