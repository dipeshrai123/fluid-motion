import { delay } from "./delay";
import { parallel } from "./parallel";
import { sequence } from "./sequence";
import { CompositeAnimation } from "./types";

export const stagger = function (
  time: number,
  animations: Array<CompositeAnimation>
): CompositeAnimation {
  return parallel(
    animations.map((animation, i) => {
      return sequence([delay(time * i), animation]);
    })
  );
};
