import { Easing } from "../Easing";
import * as Global from "../global";
import { AnimatedValue } from "./AnimatedValue";
import { Animation, EndCallback } from "./Animation";

var easeInOut = Easing.inOut(Easing.ease);

type TimingAnimationConfigSingle = {
  toValue: number | AnimatedValue;
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
};

export class TimingAnimation extends Animation {
  _startTime: number;
  _fromValue: number;
  _toValue: any;
  _duration: number;
  _delay: number;
  _easing: (value: number) => number;
  _onUpdate: (value: number) => void;
  _animationFrame: any;
  _timeout: any;

  constructor(config: TimingAnimationConfigSingle) {
    super();
    this._toValue = config.toValue;
    this._easing = config.easing !== undefined ? config.easing : easeInOut;
    this._duration = config.duration !== undefined ? config.duration : 500;
    this._delay = config.delay !== undefined ? config.delay : 0;
  }

  start = (
    fromValue: number,
    onUpdate: (value: number) => void,
    onEnd: EndCallback | null
  ): void => {
    this.__active = true;
    this._fromValue = fromValue;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;

    var start = () => {
      if (this._duration === 0) {
        this._onUpdate(this._toValue);
        this.__debouncedOnEnd({ finished: true });
      } else {
        this._startTime = Date.now();
        this._animationFrame = Global.requestAnimationFrame.current(
          this.onUpdate.bind(this)
        );
      }
    };
    if (this._delay) {
      this._timeout = setTimeout(start, this._delay);
    } else {
      start();
    }
  };

  onUpdate(): void {
    var now = Date.now();
    if (now >= this._startTime + this._duration) {
      if (this._duration === 0) {
        this._onUpdate(this._toValue);
      } else {
        this._onUpdate(
          this._fromValue + this._easing(1) * (this._toValue - this._fromValue)
        );
      }
      this.__debouncedOnEnd({ finished: true });
      return;
    }

    this._onUpdate(
      this._fromValue +
        this._easing((now - this._startTime) / this._duration) *
          (this._toValue - this._fromValue)
    );

    if (this.__active) {
      this._animationFrame = Global.requestAnimationFrame.current(
        this.onUpdate.bind(this)
      );
    }
  }

  stop(): void {
    this.__active = false;
    clearTimeout(this._timeout);
    Global.cancelAnimationFrame.current(this._animationFrame);
    this.__debouncedOnEnd({ finished: false });
  }
}
