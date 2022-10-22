import { delay } from "fluid-motion";

export const withDelay = (time: number) => () => delay(time).start();
