import {
  createAnimatedComponent,
  AnimatedValue,
  timing,
  spring,
  decay,
  parallel,
  sequence,
  delay,
  stagger,
} from "fluid-motion";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

const ADiv = createAnimatedComponent("div");

function App() {
  const left = useRef(new AnimatedValue(0)).current;

  const bind = useDrag(({ movement: [mx] }) => {
    spring(left, { toValue: mx }).start();
  });

  return (
    <>
      <div
        {...bind()}
        style={{ height: 100, background: "yellow", userSelect: "none" }}
      />
      <ADiv
        style={{
          width: 100,
          height: 100,
          backgroundColor: left.interpolate({
            inputRange: [0, 1],
            outputRange: ["red", "black"],
          }),
          position: "relative",
          left: left,
        }}
      />

      <button
        onClick={() =>
          sequence([
            delay(1000),
            spring(left, { toValue: 200 }),
            timing(left, { toValue: 500 }),
          ]).start()
        }
      >
        ANIMTE
      </button>
    </>
  );
}

export default App;
