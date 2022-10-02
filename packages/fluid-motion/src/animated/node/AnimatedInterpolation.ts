import { Animated } from "./Animated";
import { AnimatedWithChildren } from "./AnimatedWithChildren";
import { Interpolation, InterpolationConfigType } from "./Interpolation";
import { ValueListenerCallback } from "./AnimatedValue";
import { uniqueId } from "../guid";

export class AnimatedInterpolation extends AnimatedWithChildren {
  _parent: any;
  _interpolation: (input: number) => number | string;
  _listeners: { [key: number]: ValueListenerCallback };
  _parentListener: number;

  constructor(
    parent: Animated,
    interpolation: (input: number) => number | string
  ) {
    super();
    this._parent = parent;
    this._interpolation = interpolation;
    this._listeners = {};
  }

  __getValue = (): number | string => {
    var parentValue: number = this._parent.__getValue();
    if (typeof parentValue !== "number") {
      throw new Error("Cannot interpolate an input which is not a number.");
    }
    return this._interpolation(parentValue);
  };

  addListener = (callback: ValueListenerCallback): string => {
    if (!this._parentListener) {
      this._parentListener = this._parent.addListener(() => {
        for (var key in this._listeners) {
          this._listeners[key]({ value: this.__getValue() });
        }
      });
    }
    var id = uniqueId();
    this._listeners[id] = callback;
    return id;
  };

  removeListener(id: string): void {
    delete this._listeners[id];
  }

  interpolate(config: InterpolationConfigType): AnimatedInterpolation {
    return new AnimatedInterpolation(this, Interpolation.create(config));
  }

  __attach = (): void => {
    this._parent.__addChild(this);
  };

  __detach = (): void => {
    this._parent.__removeChild(this);
    this._parentListener = this._parent.removeListener(this._parentListener);
  };
}
