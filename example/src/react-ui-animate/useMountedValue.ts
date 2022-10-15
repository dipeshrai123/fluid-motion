import { spring, AnimatedValue } from "fluid-motion";
import { useRef, useState } from "react";

import { useClassicEffect } from "./useClassicEffect";

interface UseMountedValueConfig {
  from: number;
  enter: number;
  exit: number;
}

export const useMountedValue = (
  visible: boolean,
  config?: UseMountedValueConfig
) => {
  const [mounted, setMounted] = useState(visible);
  const animationConfig = useRef({
    from: config?.from ?? 0,
    enter: config?.enter ?? 1,
    exit: config?.exit ?? 0,
  });
  const animation = useRef(
    new AnimatedValue(animationConfig.current.from)
  ).current;

  useClassicEffect(() => {
    if (visible) {
      setMounted(true);
      spring(animation, { toValue: animationConfig.current.enter }).start();
    } else {
      spring(animation, { toValue: animationConfig.current.exit }).start(
        function ({ finished }) {
          if (finished) {
            setMounted(false);
          }
        }
      );
    }
  }, [visible]);

  return function (
    fn: (animation: AnimatedValue, mounted: boolean) => React.ReactNode
  ) {
    return fn(animation, mounted);
  };
};
