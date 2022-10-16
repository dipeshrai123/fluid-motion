import {
  Value,
  sequence,
  spring,
  timing,
  loop,
  TimingAnimationConfig,
  SpringAnimationConfig,
} from "fluid-motion";
import { useRef } from "react";

type Animation = (animatedValue: Value) => {
  start: (callback?: any) => void;
  reset: () => void;
  stop: () => void;
};

export const withTiming =
  (
    toValue: number | Value,
    config?: Omit<TimingAnimationConfig, "toValue">
  ): Animation =>
  (animatedValue) =>
    timing(animatedValue, { ...config, toValue });

export const withSpring =
  (
    toValue: number | Value,
    config?: Omit<SpringAnimationConfig, "toValue">
  ): Animation =>
  (animatedValue) =>
    spring(animatedValue, { ...config, toValue });

export const withSequence =
  (...animations: Array<Animation>): Animation =>
  (animatedValue) =>
    sequence(animations.map((a) => a(animatedValue)));

export const withLoop =
  (animation: Animation, iterations: number = -1): Animation =>
  (animatedValue) =>
    loop(animation(animatedValue), { iterations });

export const useAnimatedValue = (value: number) => {
  const animatedValue = useRef(new Value(value)).current;

  const targetObject: {
    value?: any;
  } = {
    value: animatedValue,
  };

  return new Proxy(targetObject, {
    get: (_, p) => {
      if (p === "value") {
        return animatedValue;
      }
    },
    set: ({ value }, p, newValue: Animation) => {
      if (p === "value") {
        if (value instanceof Value && newValue) {
          newValue(value).start();
        }

        return true;
      }

      return false;
    },
  });
};
