import { Animated } from "./Animated";
import { AnimatedValue } from "./AnimatedValue";
import { EndCallback } from "./Animation";

export class AnimatedTracking extends Animated {
  _value: AnimatedValue;
  _parent: Animated;
  _callback?: EndCallback;
  _animationConfig: any;
  _animationClass: any;

  constructor(
    value: AnimatedValue,
    parent: Animated,
    animationClass: any,
    animationConfig: any,
    callback?: EndCallback
  ) {
    super();
    this._value = value;
    this._parent = parent;
    this._animationClass = animationClass;
    this._animationConfig = animationConfig;
    this._callback = callback;
    this.__attach();
  }

  __getValue = (): object => {
    return this._parent.__getValue();
  };

  __attach = (): void => {
    this._parent.__addChild(this);
  };

  __detach = (): void => {
    this._parent.__removeChild(this);
  };

  update(): void {
    this._value.animate(
      new this._animationClass({
        ...this._animationConfig,
        toValue: (this._animationConfig.toValue as any).__getValue(),
      }),
      this._callback
    );
  }
}
