import { delay } from "fluid-motion";
import { Animation } from "./types";

export const withDelay =
  (time: number): Animation =>
  () =>
    delay(time);
