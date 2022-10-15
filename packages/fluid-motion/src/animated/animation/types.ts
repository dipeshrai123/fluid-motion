import { EndCallback } from "../node/Animation";

export type CompositeAnimation = {
  start: (callback?: EndCallback | null) => void;
  stop: () => void;
  reset: () => void;
};
