import { spring, SpringAnimationConfig, Value } from "fluid-motion";

export const withSpring =
  (toValue: number | Value, config?: Omit<SpringAnimationConfig, "toValue">) =>
  (animatedValue: Value) =>
    spring(animatedValue, { ...config, toValue }).start();
