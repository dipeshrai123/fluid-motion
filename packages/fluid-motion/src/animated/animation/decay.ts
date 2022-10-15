import { AnimatedValue } from "../node/AnimatedValue";
import { EndCallback } from "../node/Animation";
import { DecayAnimation } from "../node/DecayAnimation";
import { CompositeAnimation } from "./types";

export type DecayAnimationConfig = {
  velocity: number;
  deceleration?: number;
};

export const decay = function (
  value: AnimatedValue,
  config: DecayAnimationConfig
): CompositeAnimation {
  return {
    start: function (callback?: EndCallback) {
      const singleValue = value;
      const singleConfig = config;
      singleValue.stopTracking();
      singleValue.animate(new DecayAnimation(singleConfig), callback);
    },
    stop: function () {
      value.stopAnimation();
    },
    reset: function () {
      value.resetAnimation();
    },
  };
};
