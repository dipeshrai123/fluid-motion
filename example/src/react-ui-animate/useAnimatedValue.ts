import { Value } from "fluid-motion";
import { useRef } from "react";
import { Animation } from "./animations/types";

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
