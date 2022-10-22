import { animated, Value, spring } from "fluid-motion";
import { useRef } from "react";

function App() {
  const a = useRef(new Value(0)).current;

  return (
    <>
      <button
        onClick={() => {
          spring(a, { toValue: 0 }).start();
        }}
      >
        Animate Left
      </button>
      <button
        onClick={() => {
          spring(a, { toValue: 200 }).start();
        }}
      >
        Animate Right
      </button>

      <animated.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: "#3399ff",
          translateX: a,
          scale: a.interpolate({
            inputRange: [0, 500],
            outputRange: [1, 1.2],
          }),
          skewX: a.interpolate({
            inputRange: [0, 500],
            outputRange: [0, 100],
          }),
        }}
      />
    </>
  );
}

export default App;
