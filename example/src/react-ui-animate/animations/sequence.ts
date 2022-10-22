import { sequence } from "fluid-motion";
import { Animation } from "./types";

export const withSequence =
  (...animations: Array<Animation>): Animation =>
  (animatedValue) =>
    sequence(animations.map((a) => a(animatedValue)));
