import { Animated } from "../node/Animated";
import { AnimatedTracking } from "../node/AnimatedTracking";
import { AnimatedValue } from "../node/AnimatedValue";
import { EndCallback } from "../node/Animation";
import { SpringAnimation } from "../node/SpringAnimation";
import { CompositeAnimation } from "./types";

export type SpringAnimationConfig = {
  toValue: number | AnimatedValue;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
  tension?: number;
  friction?: number;
  mass?: number;
};

export const spring = function (
  value: AnimatedValue,
  config: SpringAnimationConfig
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
            SpringAnimation,
            singleConfig,
            callback
          )
        );
      } else {
        singleValue.animate(new SpringAnimation(singleConfig), callback);
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
