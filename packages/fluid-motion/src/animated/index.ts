import { AnimatedValue } from "./AnimatedValue";
import { AnimationConfig, EndCallback, EndResult } from "./Animation";
import { TimingAnimation } from "./TimingAnimation";
import { createAnimatedComponent } from "./createAnimatedComponent";
import { SpringAnimation } from "./SpringAnimation";
import { DecayAnimation } from "./DecayAnimation";
import { Animated } from "./Animated";
import { AnimatedTracking } from "./AnimatedTracking";

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
    start: function (callback?: EndCallback): void {
      var singleValue: any = value;
      var singleConfig: any = config;
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
    start: function (callback?: EndCallback): void {
      var singleValue: any = value;
      var singleConfig: any = config;
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

    stop: function (): void {
      value.stopAnimation();
    },
  };
};

type DecayAnimationConfig = AnimationConfig & {
  velocity: number | { x: number; y: number };
  deceleration?: number;
};

const decay = function (
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

const delay = function (time: number): CompositeAnimation {
  return timing(new AnimatedValue(0), { toValue: 0, delay: time, duration: 0 });
};

const sequence = function (
  animations: Array<CompositeAnimation>
): CompositeAnimation {
  var current = 0;
  return {
    start: function (callback?: EndCallback) {
      var onComplete = function (result: EndResult) {
        if (!result.finished) {
          callback && callback(result);
          return;
        }

        current++;

        if (current === animations.length) {
          callback && callback(result);
          return;
        }

        animations[current].start(onComplete);
      };

      if (animations.length === 0) {
        callback && callback({ finished: true });
      } else {
        animations[current].start(onComplete);
      }
    },

    stop: function () {
      if (current < animations.length) {
        animations[current].stop();
      }
    },
  };
};

type ParallelConfig = {
  stopTogether?: boolean; // If one is stopped, stop all.  default: true
};

const parallel = function (
  animations: Array<CompositeAnimation>,
  config?: ParallelConfig
): CompositeAnimation {
  var doneCount = 0;
  // Make sure we only call stop() at most once for each animation
  var hasEnded = {};
  var stopTogether = !(config && config.stopTogether === false);

  var result = {
    start: function (callback?: EndCallback) {
      if (doneCount === animations.length) {
        callback && callback({ finished: true });
        return;
      }

      animations.forEach((animation, idx) => {
        var cb = function (endResult: EndResult) {
          hasEnded[idx] = true;
          doneCount++;
          if (doneCount === animations.length) {
            doneCount = 0;
            callback && callback(endResult);
            return;
          }

          if (!endResult.finished && stopTogether) {
            result.stop();
          }
        };

        if (!animation) {
          cb({ finished: true });
        } else {
          animation.start(cb);
        }
      });
    },

    stop: function (): void {
      animations.forEach((animation, idx) => {
        !hasEnded[idx] && animation.stop();
        hasEnded[idx] = true;
      });
    },
  };

  return result;
};

const stagger = function (
  time: number,
  animations: Array<CompositeAnimation>
): CompositeAnimation {
  return parallel(
    animations.map((animation, i) => {
      return sequence([delay(time * i), animation]);
    })
  );
};

export {
  timing,
  spring,
  decay,
  delay,
  sequence,
  parallel,
  stagger,
  createAnimatedComponent,
  AnimatedValue,
};
