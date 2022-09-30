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
  mass?: number;
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
  _mass: number;
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
    this._friction = withDefault(config.friction, 14);
    this._mass = withDefault(config.mass, 1);
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

  getInternalState(): {
    lastPosition: number;
    lastVelocity: number;
    lastTime: number;
  } {
    return {
      lastPosition: this._lastPosition,
      lastVelocity: this._lastVelocity,
      lastTime: this._lastTime,
    };
  }

  onUpdate(): void {
    var now = Date.now();

    const deltaTime = Math.min(now - this._lastTime, 64);
    this._lastTime = now;

    const c = this._friction;
    const m = this._mass;
    const k = this._tension;

    const v0 = -this._lastVelocity;
    const x0 = this._toValue - this._lastPosition;

    const zeta = c / (2 * Math.sqrt(k * m)); // damping ratio
    const omega0 = Math.sqrt(k / m); // undamped angular frequency of the oscillator (rad/ms)
    const omega1 = omega0 * Math.sqrt(1 - zeta ** 2); // exponential decay

    const t = deltaTime / 1000;

    const sin1 = Math.sin(omega1 * t);
    const cos1 = Math.cos(omega1 * t);

    // under damped
    const underDampedEnvelope = Math.exp(-zeta * omega0 * t);
    const underDampedFrag1 =
      underDampedEnvelope *
      (sin1 * ((v0 + zeta * omega0 * x0) / omega1) + x0 * cos1);

    const underDampedPosition = this._toValue - underDampedFrag1;
    // This looks crazy -- it's actually just the derivative of the oscillation function
    const underDampedVelocity =
      zeta * omega0 * underDampedFrag1 -
      underDampedEnvelope *
        (cos1 * (v0 + zeta * omega0 * x0) - omega1 * x0 * sin1);

    // critically damped
    const criticallyDampedEnvelope = Math.exp(-omega0 * t);
    const criticallyDampedPosition =
      this._toValue - criticallyDampedEnvelope * (x0 + (v0 + omega0 * x0) * t);

    const criticallyDampedVelocity =
      criticallyDampedEnvelope *
      (v0 * (t * omega0 - 1) + t * x0 * omega0 * omega0);

    this._onUpdate(this._lastPosition);

    const isOvershooting = () => {
      if (this._overshootClamping && this._tension !== 0) {
        return this._lastPosition < this._toValue
          ? this._lastPosition > this._toValue
          : this._lastPosition < this._toValue;
      } else {
        return false;
      }
    };

    const isVelocity = Math.abs(this._lastVelocity) < this._restSpeedThreshold;
    const isDisplacement =
      this._tension === 0 ||
      Math.abs(this._toValue - this._lastPosition) <
        this._restDisplacementThreshold;

    if (zeta < 1) {
      this._lastPosition = underDampedPosition;
      this._lastVelocity = underDampedVelocity;
    } else {
      this._lastPosition = criticallyDampedPosition;
      this._lastVelocity = criticallyDampedVelocity;
    }

    if (isOvershooting() || (isVelocity && isDisplacement)) {
      if (this._tension !== 0) {
        this._lastVelocity = 0;
        this._lastPosition = this._toValue;

        this._onUpdate(this._lastPosition);
      }
      // clear lastTimestamp to avoid using stale value by the next spring animation that starts after this one
      this._lastTime = 0;

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
