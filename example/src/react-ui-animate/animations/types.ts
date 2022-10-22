import { Value } from "fluid-motion";

export type EndCallback = (result?: { finished: boolean }) => void;

export type Animation = (
  animatedValue: Value,
  callback?: EndCallback
) => {
  animation: {
    start: (callback?: any) => void;
    reset: () => void;
    stop: () => void;
  };
  callback?: EndCallback;
};
