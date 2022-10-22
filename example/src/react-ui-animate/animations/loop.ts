import { loop, Value } from "fluid-motion";

export const withLoop =
  (animation: (animatedValue: Value) => any, iterations: number = -1) =>
  (animatedValue: Value) =>
    loop(animation(animatedValue), { iterations }).start();
