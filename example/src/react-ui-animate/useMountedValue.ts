import { Value } from "fluid-motion";
import { useRef, useState } from "react";

import { withSpring } from "./animations";
import { useAnimatedValue } from "./useAnimatedValue";
import { useClassicEffect } from "./useClassicEffect";

import type { Animation } from "./animations/types";

interface UseMountedValueConfig {
  from: number;
  enter: Animation;
  exit: Animation;
}

export const useMountedValue = (
  visible: boolean,
  config?: UseMountedValueConfig
) => {
  const [mounted, setMounted] = useState(visible);
  const animationConfig = useRef({
    from: config?.from ?? 0,
    enter: config?.enter ?? withSpring(1),
    exit: config?.exit ?? withSpring(0),
  });
  const animation = useAnimatedValue(animationConfig.current.from);
  const enterAnimation = animationConfig.current.enter(animation.value);
  const exitAnimation = animationConfig.current.exit(animation.value);

  useClassicEffect(() => {
    if (visible) {
      setMounted(true);
      enterAnimation.animation.start(enterAnimation.callback);
    } else {
      exitAnimation.animation.start((result: { finished: boolean }) => {
        exitAnimation.callback?.(result);
        if (result.finished) {
          setMounted(false);
        }
      });
    }
  }, [visible]);

  return function (
    fn: (animation: { value: Value }, mounted: boolean) => React.ReactNode
  ) {
    return fn({ value: animation.value }, mounted);
  };
};
