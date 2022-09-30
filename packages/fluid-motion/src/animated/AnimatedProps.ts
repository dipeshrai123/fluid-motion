import { Animated } from "./Animated";
import { AnimatedStyle } from "./AnimatedStyle";

export class AnimatedProps extends Animated {
  _props: Object;
  _callback: () => void;

  constructor(props: any, callback: () => void) {
    super();
    if (props.style) {
      props = {
        ...props,
        style: new AnimatedStyle(props.style),
      };
    }
    this._props = props;
    this._callback = callback;
    this.__attach();
  }

  __getValue = (): object => {
    var props = {};
    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) {
        props[key] = value.__getValue();
      } else {
        props[key] = value;
      }
    }
    return props;
  };

  __getAnimatedValue = (): object => {
    var props = {};
    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) {
        props[key] = value.__getAnimatedValue();
      }
    }
    return props;
  };

  __attach = (): void => {
    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) {
        value.__addChild(this);
      }
    }
  };

  __detach = (): void => {
    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) {
        value.__removeChild(this);
      }
    }
  };

  update(): void {
    this._callback();
  }
}
