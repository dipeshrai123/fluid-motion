import { timing, TimingAnimationConfig, Value } from "fluid-motion";
import { Animation } from "./types";

export const withTiming =
  (
    toValue: number | Value,
    config?: Omit<TimingAnimationConfig, "toValue">
  ): Animation =>
  (animatedValue) =>
    timing(animatedValue, { ...config, toValue });
