import * as Global from "../global";
import { Animation, EndCallback } from "./Animation";

type DecayAnimationConfigSingle = {
  velocity: number;
  deceleration?: number;
};

export class DecayAnimation extends Animation {
  _startTime: number;
  _lastValue: number;
  _fromValue: number;
  _deceleration: number;
  _velocity: number;
  _onUpdate: (value: number) => void;
  _animationFrame: any;

  constructor(config: DecayAnimationConfigSingle) {
    super();
    this._deceleration =
      config.deceleration !== undefined ? config.deceleration : 0.998;
    this._velocity = config.velocity;
  }

  start = (
    fromValue: number,
    onUpdate: (value: number) => void,
    onEnd: EndCallback
  ): void => {
    this.__active = true;
    this._lastValue = fromValue;
    this._fromValue = fromValue;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;
    this._startTime = Date.now();
    this._animationFrame = Global.requestAnimationFrame.current(
      this.onUpdate.bind(this)
    );
  };

  onUpdate(): void {
    var now = Date.now();

    var value =
      this._fromValue +
      (this._velocity / (1 - this._deceleration)) *
        (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)));

    this._onUpdate(value);

    if (Math.abs(this._lastValue - value) < 0.1) {
      this.__debouncedOnEnd({ finished: true });
      return;
    }

    this._lastValue = value;
    if (this.__active) {
      this._animationFrame = Global.requestAnimationFrame.current(
        this.onUpdate.bind(this)
      );
    }
  }

  stop(): void {
    this.__active = false;
    Global.cancelAnimationFrame.current(this._animationFrame);
    this.__debouncedOnEnd({ finished: false });
  }
}
