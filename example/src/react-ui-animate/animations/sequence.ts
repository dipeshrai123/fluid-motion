import { sequence, Value } from "fluid-motion";

export const withSequence =
  (...animations: Array<(animatedValue: Value) => any>) =>
  (animatedValue: Value) =>
    sequence(animations.map((a) => a(animatedValue))).start();
