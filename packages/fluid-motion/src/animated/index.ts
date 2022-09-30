import { AnimatedValue } from "./AnimatedValue";
import { AnimationConfig, EndCallback } from "./Animation";
import { TimingAnimation } from "./TimingAnimation";
import { createAnimatedComponent } from "./createAnimatedComponent";

type TimingAnimationConfig = AnimationConfig & {
  toValue: number | AnimatedValue;
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
};

type CompositeAnimation = {
  start: (callback?: EndCallback | null) => void;
  stop: () => void;
};

var timing = function (
  value: AnimatedValue,
  config: TimingAnimationConfig
): CompositeAnimation {
  return {
    start: function (callback: EndCallback | null): void {
      var singleValue = value;
      var singleConfig = config;
      singleValue.stopTracking();
      singleValue.animate(new TimingAnimation(singleConfig), callback);
    },

    stop: function (): void {
      value.stopAnimation();
    },
  };
};

export { timing, createAnimatedComponent, AnimatedValue };
