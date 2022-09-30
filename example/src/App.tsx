import {
  createAnimatedComponent,
  AnimatedValue,
  timing,
  spring,
} from "fluid-motion";
import { useRef } from "react";

const ADiv = createAnimatedComponent("div");

function App() {
  const opacity = useRef(new AnimatedValue(0)).current;

  return (
    <>
      <ADiv
        style={{
          width: 100,
          height: 100,
          backgroundColor: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: ["red", "black"],
          }),
          position: "relative",
          left: opacity,
        }}
      />

      <button onClick={() => spring(opacity, { toValue: 500 }).start()}>
        ANIMTE
      </button>
    </>
  );
}

export default App;
