import { AnimatedValue } from "../node/AnimatedValue";
import { timing } from "./timing";
import { CompositeAnimation } from "./types";

export const delay = function (time: number): CompositeAnimation {
  return timing(new AnimatedValue(0), { toValue: 0, delay: time, duration: 0 });
};
