import { timing, TimingAnimationConfig, Value } from "fluid-motion";

export const withTiming =
  (
    toValue: number | Value,
    config?: Omit<TimingAnimationConfig, "toValue">,
    callback?: (result: { finished: boolean }) => void
  ) =>
  (animatedValue: Value) =>
    timing(animatedValue, { ...config, toValue }).start(callback);
