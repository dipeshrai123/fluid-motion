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

// Merges two refs
export function updateRef<T>(ref: React.Ref<T>, value: T) {
  if (ref) {
    if (isFunction(ref)) ref(value);
    else (ref as any).current = value;
  }
  return value;
}
