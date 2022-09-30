import { AnimatedValue } from "./AnimatedValue";
import { Animation, AnimationConfig, EndCallback } from "./Animation";
import {
  CancelAnimationFrame,
  RequestAnimationFrame,
} from "./injectable/RequestAnimationFrame";

type SpringAnimationConfigSingle = AnimationConfig & {
  toValue: number | AnimatedValue;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
  bounciness?: number;
  speed?: number;
  tension?: number;
  friction?: number;
};

function withDefault<T>(value: T | null, defaultValue: T): any {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value;
}

export class SpringAnimation extends Animation {
  _overshootClamping: boolean;
  _restDisplacementThreshold: number;
  _restSpeedThreshold: number;
  _initialVelocity?: number;
  _lastVelocity: number;
  _startPosition: number;
  _lastPosition: number;
  _fromValue: number;
  _toValue: any;
  _tension: number;
  _friction: number;
  _lastTime: number;
  _onUpdate: (value: number) => void;
  _animationFrame: any;

  constructor(config: SpringAnimationConfigSingle) {
    super();

    this._overshootClamping = withDefault(config.overshootClamping, false);
    this._restDisplacementThreshold = withDefault(
      config.restDisplacementThreshold,
      0.001
    );
    this._restSpeedThreshold = withDefault(config.restSpeedThreshold, 0.001);
    this._initialVelocity = config.velocity;
    this._lastVelocity = withDefault(config.velocity, 0);
    this._toValue = config.toValue;
    this.__isInteraction =
      config.isInteraction !== undefined ? config.isInteraction : true;
    this._tension = withDefault(config.tension, 160);
    this._friction = withDefault(config.friction, 17);
  }

  start = (
    fromValue: number,
    onUpdate: (value: number) => void,
    onEnd: EndCallback | null,
    previousAnimation: Animation | null
  ): void => {
    this.__active = true;
    this._startPosition = fromValue;
    this._lastPosition = this._startPosition;

    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;
    this._lastTime = Date.now();

    if (previousAnimation instanceof SpringAnimation) {
      var internalState = previousAnimation.getInternalState();
      this._lastPosition = internalState.lastPosition;
      this._lastVelocity = internalState.lastVelocity;
      this._lastTime = internalState.lastTime;
    }
    if (this._initialVelocity !== undefined && this._initialVelocity !== null) {
      this._lastVelocity = this._initialVelocity;
    }
    this.onUpdate();
  };

  getInternalState(): { lastPosition: any; lastVelocity: any; lastTime: any } {
    return {
      lastPosition: this._lastPosition,
      lastVelocity: this._lastVelocity,
      lastTime: this._lastTime,
    };
  }

  onUpdate(): void {
    var position = this._lastPosition;
    var velocity = this._lastVelocity;

    var tempPosition = this._lastPosition;
    var tempVelocity = this._lastVelocity;

    var MAX_STEPS = 64;
    var now = Date.now();
    if (now > this._lastTime + MAX_STEPS) {
      now = this._lastTime + MAX_STEPS;
    }

    var TIMESTEP_MSEC = 1;
    var numSteps = Math.floor((now - this._lastTime) / TIMESTEP_MSEC);

    for (var i = 0; i < numSteps; ++i) {
      var step = TIMESTEP_MSEC / 1000;

      var aVelocity = velocity;
      var aAcceleration =
        this._tension * (this._toValue - tempPosition) -
        this._friction * tempVelocity;
      var tempPosition = position + (aVelocity * step) / 2;
      var tempVelocity = velocity + (aAcceleration * step) / 2;

      var bVelocity = tempVelocity;
      var bAcceleration =
        this._tension * (this._toValue - tempPosition) -
        this._friction * tempVelocity;
      tempPosition = position + (bVelocity * step) / 2;
      tempVelocity = velocity + (bAcceleration * step) / 2;

      var cVelocity = tempVelocity;
      var cAcceleration =
        this._tension * (this._toValue - tempPosition) -
        this._friction * tempVelocity;
      tempPosition = position + (cVelocity * step) / 2;
      tempVelocity = velocity + (cAcceleration * step) / 2;

      var dVelocity = tempVelocity;
      var dAcceleration =
        this._tension * (this._toValue - tempPosition) -
        this._friction * tempVelocity;
      tempPosition = position + (cVelocity * step) / 2;
      tempVelocity = velocity + (cAcceleration * step) / 2;

      var dxdt = (aVelocity + 2 * (bVelocity + cVelocity) + dVelocity) / 6;
      var dvdt =
        (aAcceleration + 2 * (bAcceleration + cAcceleration) + dAcceleration) /
        6;

      position += dxdt * step;
      velocity += dvdt * step;
    }

    this._lastTime = now;
    this._lastPosition = position;
    this._lastVelocity = velocity;

    this._onUpdate(position);
    if (!this.__active) {
      // a listener might have stopped us in _onUpdate
      return;
    }

    // Conditions for stopping the spring animation
    var isOvershooting = false;
    if (this._overshootClamping && this._tension !== 0) {
      if (this._startPosition < this._toValue) {
        isOvershooting = position > this._toValue;
      } else {
        isOvershooting = position < this._toValue;
      }
    }
    var isVelocity = Math.abs(velocity) <= this._restSpeedThreshold;
    var isDisplacement = true;
    if (this._tension !== 0) {
      isDisplacement =
        Math.abs(this._toValue - position) <= this._restDisplacementThreshold;
    }

    if (isOvershooting || (isVelocity && isDisplacement)) {
      if (this._tension !== 0) {
        // Ensure that we end up with a round value
        this._onUpdate(this._toValue);
      }

      this.__debouncedOnEnd({ finished: true });
      return;
    }
    this._animationFrame = RequestAnimationFrame.current(
      this.onUpdate.bind(this)
    );
  }

  stop(): void {
    this.__active = false;
    CancelAnimationFrame.current(this._animationFrame);
    this.__debouncedOnEnd({ finished: false });
  }
}
