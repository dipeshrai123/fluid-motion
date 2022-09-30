import React, { useRef, forwardRef, useEffect, useCallback } from "react";
import { AnimatedProps } from "./AnimatedProps";
// import { ApplyAnimatedValues } from "./injectable/ApplyAnimatedValues";

export function createAnimatedComponent(Component: any): any {
  function Wrapper(props: any) {
    const node = useRef<any>(null);

    // const attachProps = useCallback((props: any) => )

    useEffect(() => {
      const animatedProps = new AnimatedProps(props, () => false);
      console.log(animatedProps);
    }, []);

    return (
      <Component
        ref={(childRef: any) => (node.current = childRef)}
        {...props}
      />
    );
  }

  return forwardRef(Wrapper);
}
