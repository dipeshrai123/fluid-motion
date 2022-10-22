import { loop } from "fluid-motion";
import { Animation } from "./types";

export const withLoop =
  (animation: Animation, iterations: number = -1): Animation =>
  (animatedValue) => ({
    animation: loop(animation(animatedValue).animation, { iterations }),
    callback: () => false,
  });
