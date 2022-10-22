import { timing, TimingAnimationConfig, Value } from "fluid-motion";
import { Animation } from "./types";

export const withTiming =
  (
    toValue: number | Value,
    config?: Omit<TimingAnimationConfig, "toValue">,
    callback?: (result?: { finished: boolean }) => void
  ): Animation =>
  (animatedValue) => ({
    animation: timing(animatedValue, { ...config, toValue }),
    callback,
  });
