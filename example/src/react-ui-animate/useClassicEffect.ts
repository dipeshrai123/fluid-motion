import { useEffect } from "react";

export const useClassicEffect = (
  effect?: React.EffectCallback,
  deps?: React.DependencyList
) => {
  useEffect(() => {
    let subscribed = true;
    let unsub: void | (() => void);

    queueMicrotask(() => {
      if (subscribed) {
        unsub = effect?.();
      }
    });

    return () => {
      subscribed = false;
      unsub?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
