import { EndCallback, EndResult } from "../node/Animation";
import { CompositeAnimation } from "./types";

export const sequence = function (
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
    reset: function () {
      animations.forEach((animation, idx) => {
        if (idx <= current) {
          animation.reset();
        }
      });
      current = 0;
    },
  };
};
