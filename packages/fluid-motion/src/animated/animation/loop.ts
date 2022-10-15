import { EndCallback, EndResult } from "../node/Animation";
import { CompositeAnimation } from "./types";

export type LoopAnimationConfig = {
  iterations?: number;
  resetBeforeIteration?: boolean;
};

export const loop = function (
  animation: CompositeAnimation,
  config?: LoopAnimationConfig
): CompositeAnimation {
  const iterations = config?.iterations ?? -1;
  const resetBeforeIteration = config?.resetBeforeIteration ?? true;
  let isFinished = false;
  let iterationsSoFar = 0;
  return {
    start: function (callback?: EndCallback) {
      const restart = function (result: EndResult = { finished: true }): void {
        if (
          isFinished ||
          iterationsSoFar === iterations ||
          result.finished === false
        ) {
          callback && callback(result);
        } else {
          iterationsSoFar++;
          resetBeforeIteration && animation.reset();
          animation.start(restart);
        }
      };
      if (!animation || iterations === 0) {
        callback && callback({ finished: true });
      } else {
        restart(); // Start looping recursively
      }
    },
    stop: function () {
      isFinished = true;
      animation.stop();
    },
    reset: function () {
      iterationsSoFar = 0;
      isFinished = false;
      animation.reset();
    },
  };
};
