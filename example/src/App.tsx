import { createAnimatedComponent, AnimatedValue, timing } from "fluid-motion";
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
          backgroundColor: "red",
          position: "relative",
          opacity,
        }}
      />

      <button onClick={() => timing(opacity, { toValue: 1 }).start()}>
        ANIMTE
      </button>
    </>
  );
}

export default App;
