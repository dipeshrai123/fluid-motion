import { AnimatedValue } from "../node/AnimatedValue";
import { EndCallback } from "../node/Animation";
import { DecayAnimation } from "../node/DecayAnimation";
import { CompositeAnimation } from "./types";

export type DecayAnimationConfig = {
  velocity: number | { x: number; y: number };
  deceleration?: number;
};

export const decay = function (
  value: AnimatedValue,
  config: DecayAnimationConfig
): CompositeAnimation {
  return {
    start: function (callback?: EndCallback): void {
      var singleValue: any = value;
      var singleConfig: any = config;
      singleValue.stopTracking();
      singleValue.animate(new DecayAnimation(singleConfig), callback);
    },
    stop: function (): void {
      value.stopAnimation();
    },
  };
};
