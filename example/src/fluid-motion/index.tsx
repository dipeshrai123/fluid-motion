import { animated, Value, loop, timing, sequence } from "fluid-motion";
import { useRef } from "react";

function App() {
  const a = useRef(new Value(0)).current;

  return (
    <>
      <button
        onClick={() => {
          timing(a, { toValue: 0 }).start();
        }}
      >
        Animate Left
      </button>
      <button
        onClick={() => {
          sequence([
            loop(
              sequence([
                timing(a, { toValue: 1, duration: 50 }),
                timing(a, { toValue: -1, duration: 50 }),
              ]),
              {
                iterations: 5,
              }
            ),
            timing(a, { toValue: 0, duration: 50 }),
          ]).start();
        }}
      >
        Animate Right
      </button>

      <animated.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: "#3399ff",
          position: "relative",
          transform: a.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ["rotate(-10deg)", "rotate(0deg)", "rotate(10deg)"],
          }),
        }}
      />
    </>
  );
}

export default App;
