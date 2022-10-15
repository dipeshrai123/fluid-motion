import { animated } from "fluid-motion";
import {
  useAnimatedValue,
  withTiming,
  withSequence,
} from "./react-ui-animate/useAnimatedValue";

function App() {
  const a = useAnimatedValue(0);

  return (
    <>
      <button
        onClick={() => {
          a.value = withTiming(0);
        }}
      >
        Animate Left
      </button>
      <button
        onClick={() => {
          a.value = withSequence(
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(8, { duration: 50 }),
            withTiming(-8, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );
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
          left: a.value,
        }}
      />
    </>
  );
}

export default App;
