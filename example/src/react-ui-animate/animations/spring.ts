import { spring, SpringAnimationConfig, Value } from "fluid-motion";
import { Animation } from "./types";

export const withSpring =
  (
    toValue: number | Value,
    config?: Omit<SpringAnimationConfig, "toValue">
  ): Animation =>
  (animatedValue) =>
    spring(animatedValue, { ...config, toValue });
