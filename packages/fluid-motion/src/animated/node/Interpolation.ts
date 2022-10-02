import { normalizeColor } from "../normalizeColor";

type ExtrapolateType = "extend" | "identity" | "clamp";

export type InterpolationConfigType = {
  inputRange: Array<number>;
  outputRange: Array<number> | Array<string>;
  easing?: (input: number) => number;
  extrapolate?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
};

var linear = (t: any) => t;

export class Interpolation {
  static create(
    config: InterpolationConfigType
  ): (input: number) => number | string {
    if (config.outputRange && typeof config.outputRange[0] === "string") {
      return createInterpolationFromStringOutputRange(config);
    }

    var outputRange: Array<number> = config.outputRange as any;
    checkInfiniteRange("outputRange", outputRange);

    var inputRange = config.inputRange;
    checkInfiniteRange("inputRange", inputRange);
    checkValidInputRange(inputRange);

    if (inputRange.length !== outputRange.length) {
      throw new Error(
        "inputRange (" +
          inputRange.length +
          ") and outputRange (" +
          outputRange.length +
          ") must have the same length"
      );
    }

    var easing = config.easing || linear;

    var extrapolateLeft: ExtrapolateType = "extend";
    if (config.extrapolateLeft !== undefined) {
      extrapolateLeft = config.extrapolateLeft;
    } else if (config.extrapolate !== undefined) {
      extrapolateLeft = config.extrapolate;
    }

    var extrapolateRight: ExtrapolateType = "extend";
    if (config.extrapolateRight !== undefined) {
      extrapolateRight = config.extrapolateRight;
    } else if (config.extrapolate !== undefined) {
      extrapolateRight = config.extrapolate;
    }

    return (input) => {
      if (typeof input !== "number") {
        throw new Error("Cannot interpolation an input which is not a number");
      }

      var range = findRange(input, inputRange);
      return interpolate(
        input,
        inputRange[range],
        inputRange[range + 1],
        outputRange[range],
        outputRange[range + 1],
        easing,
        extrapolateLeft,
        extrapolateRight
      );
    };
  }
}

function interpolate(
  input: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  easing: (input: number) => number,
  extrapolateLeft: ExtrapolateType,
  extrapolateRight: ExtrapolateType
) {
  var result = input;

  // Extrapolate
  if (result < inputMin) {
    if (extrapolateLeft === "identity") {
      return result;
    } else if (extrapolateLeft === "clamp") {
      result = inputMin;
    } else if (extrapolateLeft === "extend") {
      // noop
    }
  }

  if (result > inputMax) {
    if (extrapolateRight === "identity") {
      return result;
    } else if (extrapolateRight === "clamp") {
      result = inputMax;
    } else if (extrapolateRight === "extend") {
      // noop
    }
  }

  if (outputMin === outputMax) {
    return outputMin;
  }

  if (inputMin === inputMax) {
    if (input <= inputMin) {
      return outputMin;
    }
    return outputMax;
  }

  // Input Range
  if (inputMin === -Infinity) {
    result = -result;
  } else if (inputMax === Infinity) {
    result = result - inputMin;
  } else {
    result = (result - inputMin) / (inputMax - inputMin);
  }

  // Easing
  result = easing(result);

  // Output Range
  if (outputMin === -Infinity) {
    result = -result;
  } else if (outputMax === Infinity) {
    result = result + outputMin;
  } else {
    result = result * (outputMax - outputMin) + outputMin;
  }

  return result;
}

function colorToRgba(input: string): string {
  var int32Color = normalizeColor(input);
  if (int32Color === null) {
    return input;
  }

  int32Color = int32Color || 0; // $FlowIssue

  var r = (int32Color & 0xff000000) >>> 24;
  var g = (int32Color & 0x00ff0000) >>> 16;
  var b = (int32Color & 0x0000ff00) >>> 8;
  var a = (int32Color & 0x000000ff) / 255;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

var stringShapeRegex = /[0-9\.-]+/g;

/**
 * Supports string shapes by extracting numbers so new values can be computed,
 * and recombines those values into new strings of the same shape.  Supports
 * things like:
 *
 *   rgba(123, 42, 99, 0.36) // colors
 *   -45deg                  // values with units
 */
function createInterpolationFromStringOutputRange(
  config: InterpolationConfigType
): (input: number) => string {
  var outputRange: Array<string> = config.outputRange as any;
  if (!(outputRange.length >= 2)) {
    throw new Error("Bad output range");
  }
  outputRange = outputRange.map(colorToRgba);
  checkPattern(outputRange);

  // ['rgba(0, 100, 200, 0)', 'rgba(50, 150, 250, 0.5)']
  // ->
  // [
  //   [0, 50],
  //   [100, 150],
  //   [200, 250],
  //   [0, 0.5],
  // ]
  /* $FlowFixMe(>=0.18.0): `outputRange[0].match()` can return `null`. Need to
   * guard against this possibility.
   */
  var outputRanges: any = outputRange[0].match(stringShapeRegex)!.map(() => []);
  outputRange.forEach((value) => {
    /* $FlowFixMe(>=0.18.0): `value.match()` can return `null`. Need to guard
     * against this possibility.
     */
    value.match(stringShapeRegex)!.forEach((number, i) => {
      outputRanges[i].push(+number);
    });
  });

  /* $FlowFixMe(>=0.18.0): `outputRange[0].match()` can return `null`. Need to
   * guard against this possibility.
   */
  var interpolations = outputRange[0]
    .match(stringShapeRegex)!
    .map((_value, i) => {
      return Interpolation.create({
        ...config,
        outputRange: outputRanges[i],
      });
    });

  // rgba requires that the r,g,b are integers.... so we want to round them, but we *dont* want to
  // round the opacity (4th column).
  const shouldRound = /^rgb/.test(outputRange[0]);

  return (input) => {
    var i = 0;
    // 'rgba(0, 100, 200, 0)'
    // ->
    // 'rgba(${interpolations[0](input)}, ${interpolations[1](input)}, ...'
    return outputRange[0].replace(stringShapeRegex, () => {
      const val: any = interpolations[i++](input);
      return String(shouldRound && i < 4 ? Math.round(val) : val);
    });
  };
}

function checkPattern(arr: Array<string>) {
  var pattern = arr[0].replace(stringShapeRegex, "");
  for (var i = 1; i < arr.length; ++i) {
    if (pattern !== arr[i].replace(stringShapeRegex, "")) {
      throw new Error("invalid pattern " + arr[0] + " and " + arr[i]);
    }
  }
}

function findRange(input: number, inputRange: Array<number>) {
  for (var i = 1; i < inputRange.length - 1; ++i) {
    if (inputRange[i] >= input) {
      break;
    }
  }
  return i - 1;
}

function checkValidInputRange(arr: Array<number>) {
  if (!(arr.length >= 2)) {
    throw new Error("inputRange must have at least 2 elements");
  }
  for (var i = 1; i < arr.length; ++i) {
    if (!(arr[i] >= arr[i - 1])) {
      throw new Error("inputRange must be monotonically increasing " + arr);
    }
  }
}

function checkInfiniteRange(name: string, arr: Array<number>) {
  if (!(arr.length >= 2)) {
    throw new Error(name + " must have at least 2 elements");
  }
  if (!(arr.length !== 2 || arr[0] !== -Infinity || arr[1] !== Infinity)) {
    throw new Error(name + "cannot be ]-infinity;+infinity[ " + arr);
  }
}
