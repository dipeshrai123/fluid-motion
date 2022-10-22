import { DecayAnimationConfig, decay, Value } from "fluid-motion";

export const withDecay =
  (
    config: DecayAnimationConfig,
    callback?: (result: { finished: boolean }) => void
  ) =>
  (animatedValue: Value) =>
    decay(animatedValue, config).start(callback);
