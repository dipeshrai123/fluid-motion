import { EndCallback, EndResult } from "../node/Animation";
import { CompositeAnimation } from "./types";

export type ParallelConfig = {
  stopTogether?: boolean; // If one is stopped, stop all.  default: true
};

export const parallel = function (
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
