import { uniqueId } from "../guid";
import { Animated } from "./Animated";
import { AnimatedInterpolation } from "./AnimatedInterpolation";
import { AnimatedWithChildren } from "./AnimatedWithChildren";
import { Animation, EndCallback } from "./Animation";
import { Interpolation, InterpolationConfigType } from "./Interpolation";

export type ValueListenerCallback = (state: { value: string | number }) => void;

function _flush(rootNode: AnimatedValue): void {
  var animatedStyles = new Set();
  function findAnimatedStyles(node: any) {
    if (typeof node.update === "function") {
      animatedStyles.add(node);
    } else {
      node.__getChildren().forEach(findAnimatedStyles);
    }
  }
  findAnimatedStyles(rootNode);
  animatedStyles.forEach((animatedStyle: any) => animatedStyle.update());
}

/**
 * Standard value for driving animations.  One `Animated.Value` can drive
 * multiple properties in a synchronized fashion, but can only be driven by one
 * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
 * or calling `setValue`) will stop any previous ones.
 */
export class AnimatedValue extends AnimatedWithChildren {
  _value: number;
  _offset: number;
  _animation: Animation | null;
  _tracking: Animated | null;
  _listeners: { [key: string]: ValueListenerCallback };

  constructor(value: number) {
    super();
    this._value = value;
    this._offset = 0;
    this._animation = null;
    this._listeners = {};
  }

  __detach = () => {
    this.stopAnimation();
  };

  __getValue = (): number => {
    return this._value + this._offset;
  };

  /**
   * Directly set the value.  This will stop any animations running on the value
   * and update all the bound properties.
   */
  setValue(value: number): void {
    if (this._animation) {
      this._animation.stop();
      this._animation = null;
    }
    this._updateValue(value);
  }

  /**
   * Sets an offset that is applied on top of whatever value is set, whether via
   * `setValue`, an animation, or `Animated.event`.  Useful for compensating
   * things like the start of a pan gesture.
   */
  setOffset(offset: number): void {
    this._offset = offset;
  }

  /**
   * Merges the offset value into the base value and resets the offset to zero.
   * The final output of the value is unchanged.
   */
  flattenOffset(): void {
    this._value += this._offset;
    this._offset = 0;
  }

  /**
   * Adds an asynchronous listener to the value so you can observe updates from
   * animations.  This is useful because there is no way to
   * synchronously read the value because it might be driven natively.
   */
  addListener(callback: ValueListenerCallback): string {
    var id = uniqueId();
    this._listeners[id] = callback;
    return id;
  }

  removeListener(id: string): void {
    delete this._listeners[id];
  }

  removeAllListeners(): void {
    this._listeners = {};
  }

  /**
   * Stops any running animation or tracking.  `callback` is invoked with the
   * final value after stopping the animation, which is useful for updating
   * state to match the animation position with layout.
   */
  stopAnimation(callback?: ((value: number) => void) | null): void {
    this.stopTracking();
    this._animation && this._animation.stop();
    this._animation = null;
    callback && callback(this.__getValue());
  }

  /**
   * Interpolates the value before updating the property, e.g. mapping 0-1 to
   * 0-10.
   */
  interpolate(config: InterpolationConfigType): AnimatedInterpolation {
    return new AnimatedInterpolation(this, Interpolation.create(config));
  }

  /**
   * Typically only used internally, but could be used by a custom Animation
   * class.
   */
  animate(animation: Animation, callback?: EndCallback): void {
    var previousAnimation = this._animation;
    this._animation && this._animation.stop();
    this._animation = animation;
    animation.start(
      this._value,
      (value) => {
        this._updateValue(value);
      },
      (result) => {
        this._animation = null;
        callback && callback(result);
      },
      previousAnimation
    );
  }

  /**
   * Typically only used internally.
   */
  stopTracking(): void {
    this._tracking && this._tracking.__detach();
    this._tracking = null;
  }

  /**
   * Typically only used internally.
   */
  track(tracking: Animated): void {
    this.stopTracking();
    this._tracking = tracking;
  }

  _updateValue(value: number): void {
    this._value = value;
    _flush(this);
    for (var key in this._listeners) {
      this._listeners[key]({ value: this.__getValue() });
    }
  }
}
