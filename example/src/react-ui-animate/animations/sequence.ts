import { sequence } from "fluid-motion";
import { Animation } from "./types";

export const withSequence =
  (...animations: Array<Animation>): Animation =>
  (animatedValue) => ({
    animation: sequence(animations.map((a) => a(animatedValue).animation)),
    callback: () => false,
  });
