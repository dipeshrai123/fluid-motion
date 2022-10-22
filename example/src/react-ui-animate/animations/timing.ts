import { timing, TimingAnimationConfig, Value } from "fluid-motion";

export const withTiming =
  (toValue: number | Value, config?: Omit<TimingAnimationConfig, "toValue">) =>
  (animatedValue: Value) =>
    timing(animatedValue, { ...config, toValue }).start();
