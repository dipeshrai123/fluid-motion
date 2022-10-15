import { AnimatedValue, loop, timing, sequence, animated } from "fluid-motion";
import { useRef } from "react";

function App() {
  const left = useRef(new AnimatedValue(0)).current;

  return (
    <>
      <button
        onClick={() =>
          loop(
            sequence([
              timing(left, { toValue: 500 }),
              timing(left, { toValue: 0 }),
            ]),
            {
              iterations: 5,
            }
          ).start()
        }
      >
        Animate Me
      </button>
      <animated.div
        style={{
          width: left.interpolate({
            inputRange: [0, 500],
            outputRange: [100, 200],
          }),
          height: 100,
          backgroundColor: "#3399ff",
          position: "relative",
          left: left,
        }}
      />
    </>
  );
}

export default App;
