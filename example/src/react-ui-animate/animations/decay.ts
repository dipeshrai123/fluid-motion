import { DecayAnimationConfig, decay, Value } from "fluid-motion";

export const withDecay =
  (config: DecayAnimationConfig) => (animatedValue: Value) =>
    decay(animatedValue, config).start();
