import { DecayAnimationConfig, decay } from "fluid-motion";
import { Animation } from "./types";

export const withDecay =
  (
    config: DecayAnimationConfig,
    callback?: (result?: { finished: boolean }) => void
  ): Animation =>
  (animatedValue) => ({
    animation: decay(animatedValue, config),
    callback,
  });
