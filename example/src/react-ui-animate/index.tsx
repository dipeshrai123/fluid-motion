import { useDrag } from "@use-gesture/react";
import { animated } from "fluid-motion";
import { withSequence, withSpring } from "./animations";
import { useAnimatedValue } from "./useAnimatedValue";

function App() {
  const a = useAnimatedValue(0);

  const bind = useDrag(
    ({ down, velocity: [vx], direction: [dx], movement: [mx] }) => {
      if (down) {
        a.value = withSpring(mx);
      } else {
        a.value = withSequence(withSpring(100), withSpring(0));
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
          background: "#3399ff",
          translateX: a.value,
        }}
      />
    </>
  );
}

export default App;
