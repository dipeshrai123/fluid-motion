import React, { useRef, forwardRef, useCallback, useLayoutEffect } from "react";
import { isFunction, useForceUpdate } from "./helpers";
import { AnimatedProps } from "./node/AnimatedProps";
import * as Global from "./global";

export function createAnimatedComponent(Component: any): any {
  return forwardRef((props: any, ref: React.Ref<any>) => {
    const instanceRef = useRef<any>(null);
    const hasInstance: boolean =
      !isFunction(Component) || Component.prototype.isReactComponent;
    const animatedProps = useRef<AnimatedProps | null>(null);
    const forceUpdate = useForceUpdate();

    const attachProps = useCallback(() => {
      const oldAnimatedProps = animatedProps.current;

      const callback = () => {
        const instance = instanceRef.current;

        if (animatedProps.current) {
          const didUpdate = instance
            ? Global.applyAnimatedValues.current(
                instance,
                animatedProps.current.__getValue()
              )
            : false;

          if (!didUpdate) {
            forceUpdate();
          }
        }
      };

      callback(); // apply the props on first render
      animatedProps.current = new AnimatedProps(props, callback);
      oldAnimatedProps && oldAnimatedProps.__detach();
    }, []);

    useLayoutEffect(() => {
      attachProps();
    }, []);

    return (
      <Component
        ref={
          hasInstance &&
          ((value: any) => (instanceRef.current = updateRef(ref, value)))
        }
      />
    );
  });
}

function updateRef<T>(ref: React.Ref<T>, value: T) {
  if (ref) {
    if (isFunction(ref)) ref(value);
    else (ref as any).current = value;
  }
  return value;
}
