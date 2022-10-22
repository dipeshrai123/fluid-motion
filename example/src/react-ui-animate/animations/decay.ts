import { DecayAnimationConfig, decay } from "fluid-motion";
import { Animation } from "./types";

export const withDecay =
  (config: DecayAnimationConfig): Animation =>
  (animatedValue) =>
    decay(animatedValue, config);
