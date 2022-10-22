import { Value } from "fluid-motion";

export type Animation = (animatedValue: Value) => {
  start: (callback?: any) => void;
  reset: () => void;
  stop: () => void;
};
