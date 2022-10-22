import React, {
  useRef,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  createElement,
} from "react";

import { AnimatedProps } from "./node/AnimatedProps";
import { Animated } from "./node/Animated";
import { isFunction, updateRef, useForceUpdate } from "./helpers";
import * as Global from "./global";

export type AnimatableComponent = React.ElementType | React.ComponentType<any>;

export type AnimatableComponentProps<T extends AnimatableComponent> = Omit<
  {
    [property in keyof React.ComponentPropsWithoutRef<T>]:
      | React.ComponentPropsWithoutRef<T>[property]
      | Animated;
  },
  "style"
> & {
  style?: {
    [key in keyof React.CSSProperties]: React.CSSProperties[key] | Animated;
  } & {
    [key in keyof typeof Global.isStyleTransformKeys]?:
      | number
      | string
      | Animated;
  };
};

export function createAnimatedComponent<C extends AnimatableComponent>(
  Component: C
) {
  const hasInstance: boolean =
    !isFunction(Component) || Component.prototype.isReactComponent;

  return forwardRef(
    (props: AnimatableComponentProps<C>, forwardedRef: React.Ref<C>) => {
      const instanceRef = useRef<any>(null);

      const ref =
        hasInstance &&
        useCallback(
          (value: any) => {
            instanceRef.current = updateRef(forwardedRef, value);
          },
          [forwardedRef]
        );

      const animatedProps = useRef<AnimatedProps | null>(null);
      const forceUpdate = useForceUpdate();

      const attachProps = useCallback(() => {
        const oldAnimatedProps = animatedProps.current;

        const callback = () => {
          const instance = instanceRef.current;

          if (hasInstance && !instance) {
            return;
          }

          if (animatedProps.current) {
            const didUpdate = instance
              ? Global.applyAnimatedValues.current(
                  instance,
                  animatedProps.current.__getValue()
                )
              : false;

            // force re-render when the instance is not available
            if (didUpdate === false) {
              forceUpdate();
            }
          }
        };

        animatedProps.current = new AnimatedProps(props, callback);
        oldAnimatedProps && oldAnimatedProps.__detach();
      }, []);

      useLayoutEffect(() => {
        attachProps();
      }, []);

      /**
       * TODO: - create a custom function to retrieve the props
       * rather than using new AnimatedProps node ( creating new instance )
       */
      const initialProps = useMemo(() => {
        const p = new AnimatedProps(props, () => false).__getValue();

        if ("style" in p) {
          p["style"] = Global.parseTransformStyle(p["style"]);
        }

        return p;
      }, [props]);

      return createElement(Component, { ...initialProps, ref });
    }
  );
}
