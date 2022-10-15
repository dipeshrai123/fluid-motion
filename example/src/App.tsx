import {
  createAnimatedComponent,
  AnimatedValue,
  loop,
  timing,
  sequence,
} from "fluid-motion";
import { useRef } from "react";

const ADiv = createAnimatedComponent("div");

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
      <ADiv
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
