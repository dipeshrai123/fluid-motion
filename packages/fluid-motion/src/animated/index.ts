import { AnimatedValue } from "./AnimatedValue";
import { AnimationConfig, EndCallback } from "./Animation";
import { TimingAnimation } from "./TimingAnimation";
import { createAnimatedComponent } from "./createAnimatedComponent";
import { SpringAnimation } from "./SpringAnimation";

type CompositeAnimation = {
  start: (callback?: EndCallback | null) => void;
  stop: () => void;
};

type TimingAnimationConfig = AnimationConfig & {
  toValue: number | AnimatedValue;
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
};

const timing = function (
  value: AnimatedValue,
  config: TimingAnimationConfig
): CompositeAnimation {
  return {
    start: function (callback: EndCallback | null): void {
      const singleValue = value;
      const singleConfig = config;
      singleValue.stopTracking();
      singleValue.animate(new TimingAnimation(singleConfig), callback);
    },

    stop: function (): void {
      value.stopAnimation();
    },
  };
};

type SpringAnimationConfig = AnimationConfig & {
  toValue: number | AnimatedValue;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
  bounciness?: number;
  speed?: number;
  tension?: number;
  friction?: number;
  mass?: number;
};

const spring = function (
  value: AnimatedValue,
  config: SpringAnimationConfig
): CompositeAnimation {
  return {
    start: function (callback: EndCallback) {
      const singleValue = value;
      const singleConfig = config;
      singleValue.stopTracking();
      singleValue.animate(new SpringAnimation(singleConfig), callback);
    },
    stop: function () {
      value.stopAnimation();
    },
  };
};

export { timing, spring, createAnimatedComponent, AnimatedValue };
