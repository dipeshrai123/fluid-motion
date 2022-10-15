import { Animated } from "../node/Animated";
import { AnimatedTracking } from "../node/AnimatedTracking";
import { AnimatedValue } from "../node/AnimatedValue";
import { EndCallback } from "../node/Animation";
import { TimingAnimation } from "../node/TimingAnimation";
import { CompositeAnimation } from "./types";

export type TimingAnimationConfig = {
  toValue: number | AnimatedValue;
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
};

export const timing = function (
  value: AnimatedValue,
  config: TimingAnimationConfig
): CompositeAnimation {
  return {
    start: function (callback?: EndCallback) {
      var singleValue = value;
      var singleConfig = config;
      singleValue.stopTracking();
      if (config.toValue instanceof Animated) {
        singleValue.track(
          new AnimatedTracking(
            singleValue,
            config.toValue,
            TimingAnimation,
            singleConfig,
            callback
          )
        );
      } else {
        singleValue.animate(new TimingAnimation(singleConfig), callback);
      }
    },
    stop: function () {
      value.stopAnimation();
    },
    reset: function () {
      value.resetAnimation();
    },
  };
};
