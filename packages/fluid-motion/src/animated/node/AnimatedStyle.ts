import { Animated } from "./Animated";
import { AnimatedTransform } from "./AnimatedTransform";
import { AnimatedWithChildren } from "./AnimatedWithChildren";
import * as Global from "../global";

export class AnimatedStyle extends AnimatedWithChildren {
  _style: object;

  constructor(style: any) {
    super();
    style = Global.flattenStyle.current(style) || {};
    if (style.transform && !(style.transform instanceof Animated)) {
      style = {
        ...style,
        transform: new AnimatedTransform(style.transform),
      };
    }
    this._style = style;
  }

  __getValue = (): object => {
    var style = {};
    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) {
        style[key] = value.__getValue();
      } else {
        style[key] = value;
      }
    }
    return style;
  };

  __getAnimatedValue = (): object => {
    var style = {};
    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) {
        style[key] = value.__getAnimatedValue();
      }
    }
    return style;
  };

  __attach = (): void => {
    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) {
        value.__addChild(this);
      }
    }
  };

  __detach = (): void => {
    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) {
        value.__removeChild(this);
      }
    }
  };
}
