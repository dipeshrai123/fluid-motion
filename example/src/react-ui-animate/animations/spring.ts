import { spring, SpringAnimationConfig, Value } from "fluid-motion";
import { Animation } from "./types";

export const withSpring =
  (
    toValue: number | Value,
    config?: Omit<SpringAnimationConfig, "toValue">,
    callback?: (result?: { finished: boolean }) => void
  ): Animation =>
  (animatedValue) => ({
    animation: spring(animatedValue, { ...config, toValue }),
    callback,
  });
