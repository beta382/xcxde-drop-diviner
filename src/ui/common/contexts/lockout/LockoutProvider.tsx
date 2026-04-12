import { useState, type ReactNode } from "react";
import {
  LockoutContext,
  type Lockouts,
} from "~/ui/common/contexts/lockout/lockout-context";

export function LockoutProvider({ children }: { children: ReactNode }) {
  const [lockouts, setLockouts] = useState<Lockouts>({});

  return (
    <LockoutContext value={{ lockouts, setLockouts }}>
      {children}
    </LockoutContext>
  );
}
