import {
  createContext,
  useCallback,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type Lockouts = Partial<Record<"global" | "lootFinder", boolean>>;

export const LockoutContext = createContext<
  | {
      lockouts: Lockouts;
      setLockouts: Dispatch<SetStateAction<Lockouts>>;
    }
  | undefined
>(undefined);

export function useMutableLockout(
  key: keyof Lockouts,
): [boolean, (nextLockout: boolean) => void] {
  const lockoutContext = useContext(LockoutContext);
  if (!lockoutContext) {
    throw new Error(
      "useLockout requires LockoutProvider to be higher in the component tree",
    );
  }

  const { setLockouts } = lockoutContext;
  const setLockout = useCallback(
    (nextLockout: boolean): void => {
      setLockouts((prevLockouts) => ({
        ...prevLockouts,
        [key]: nextLockout,
      }));
    },
    [key, setLockouts],
  );

  return [lockoutContext.lockouts[key] ?? false, setLockout];
}

export function useLockout(key: keyof Lockouts): boolean {
  return useMutableLockout(key)[0];
}
