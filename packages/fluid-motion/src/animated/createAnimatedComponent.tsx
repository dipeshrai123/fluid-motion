import React, {
  useRef,
  forwardRef,
  useCallback,
  MutableRefObject,
  useState,
} from "react";
import { AnimatedProps } from "./AnimatedProps";
import { ApplyAnimatedValues } from "./injectable/ApplyAnimatedValues";

function useForceUpdate() {
  const [, f] = useState(false);
  const forceUpdate = useCallback(() => f((v) => !v), []);
  return forceUpdate;
}

export function createAnimatedComponent(Component: any): any {
  function Wrapper(props: any, _ref: any) {
    const node = useRef<any>(null);
    const forceUpdate = useForceUpdate();
    const propsAnimated: MutableRefObject<AnimatedProps | null> = useRef(null);

    const attachProps = useCallback((props: any) => {
      const oldPropsAnimated = propsAnimated.current;
      const callback = () => {
        let didUpdate: false | undefined = false;
        if (node.current) {
          didUpdate = ApplyAnimatedValues.current(
            node.current,
            propsAnimated.current!.__getAnimatedValue()
          );
        }
        if (!node.current || didUpdate === false) {
          forceUpdate();
        }
      };
      propsAnimated.current = new AnimatedProps(props, callback);
      oldPropsAnimated && oldPropsAnimated.__detach();
    }, []);

    attachProps(props);

    const animatedProps = propsAnimated.current?.__getValue();

    return (
      <Component
        ref={(childRef: any) => (node.current = childRef)}
        {...animatedProps}
      />
    );
  }

  return forwardRef(Wrapper);
}
