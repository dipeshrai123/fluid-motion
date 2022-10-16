import { animated } from "fluid-motion";
import { useAnimatedValue, withTiming, withLoop } from "./useAnimatedValue";

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
          a.value = withLoop(withTiming(200), 5);
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
