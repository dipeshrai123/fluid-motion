import { Value } from "fluid-motion";

type ExtrapolateType = "extend" | "identity" | "clamp";

type ExtrapolateConfig = {
  extrapolate?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
};

export const interpolate = (
  animatedValue: Value,
  inputRange: Array<number>,
  outputRange: Array<number> | Array<string>,
  extrapolateConfig?: ExtrapolateConfig
) =>
  animatedValue.interpolate({
    inputRange,
    outputRange,
    ...extrapolateConfig,
  });
