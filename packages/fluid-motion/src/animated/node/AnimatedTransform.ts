import { Animated } from "./Animated";
import { AnimatedWithChildren } from "./AnimatedWithChildren";

export class AnimatedTransform extends AnimatedWithChildren {
  _transforms: Array<object>;

  constructor(transforms: Array<object>) {
    super();
    this._transforms = transforms;
  }

  __getValue = (): Array<object> => {
    return this._transforms.map((transform) => {
      var result = {};
      for (var key in transform) {
        var value = transform[key];
        if (value instanceof Animated) {
          result[key] = value.__getValue();
        } else {
          result[key] = value;
        }
      }
      return result;
    });
  };

  __getAnimatedValue = (): Array<object> => {
    return this._transforms.map((transform) => {
      var result = {};
      for (var key in transform) {
        var value = transform[key];
        if (value instanceof Animated) {
          result[key] = value.__getAnimatedValue();
        } else {
          // All transform components needed to recompose matrix
          result[key] = value;
        }
      }
      return result;
    });
  };

  __attach = (): void => {
    this._transforms.forEach((transform) => {
      for (var key in transform) {
        var value = transform[key];
        if (value instanceof Animated) {
          value.__addChild(this);
        }
      }
    });
  };

  __detach = (): void => {
    this._transforms.forEach((transform) => {
      for (var key in transform) {
        var value = transform[key];
        if (value instanceof Animated) {
          value.__removeChild(this);
        }
      }
    });
  };
}
