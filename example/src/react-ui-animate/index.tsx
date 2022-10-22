import { useDrag } from "@use-gesture/react";
import { animated } from "fluid-motion";
import { withDecay, withSpring } from "./animations";
import { interpolate } from "./interpolate";
import { useAnimatedValue } from "./useAnimatedValue";

function App() {
  const a = useAnimatedValue(0);

  const bind = useDrag(
    ({ down, velocity: [vx], direction: [dx], offset: [ox] }) => {
      if (down) {
        a.value = withSpring(ox);
      } else {
        a.value = withDecay({ velocity: dx * vx });
      }
    }
  );

  return (
    <>
      <animated.div
        {...bind()}
        style={{
          touchAction: "none",
          width: 100,
          height: 100,
          backgroundColor: interpolate(a.value, [0, 400], ["red", "blue"], {
            extrapolate: "clamp",
          }),
          position: "relative",
          left: a.value,
        }}
      />
    </>
  );
}

export default App;
