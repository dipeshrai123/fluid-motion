import { delay } from "fluid-motion";
import { Animation } from "./types";

export const withDelay =
  (time: number): Animation =>
  () => ({ animation: delay(time), callback: () => false });
