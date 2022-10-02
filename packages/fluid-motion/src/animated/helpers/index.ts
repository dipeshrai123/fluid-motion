import { useCallback, useState } from "react";

// check whether the given value is function or not
export const isFunction = (a: unknown): a is Function =>
  typeof a === "function";

// forcefully re-renders the component
export function useForceUpdate() {
  const [, f] = useState(false);
  const forceUpdate = useCallback(() => f((v) => !v), []);
  return forceUpdate;
}
