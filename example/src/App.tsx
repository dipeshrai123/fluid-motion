import { createAnimatedComponent, AnimatedValue, spring } from "fluid-motion";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

const ADiv = createAnimatedComponent("div");

function App() {
  const aleft = useRef(new AnimatedValue(0)).current;

  const bind = useDrag(({ movement: [mx] }) => {
    spring(aleft, { toValue: mx }).start();
  });

  return (
    <>
      <div
        {...bind()}
        style={{
          height: 100,
          background: "#e1e1e1",
          userSelect: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        DRAG MOUSE HERE
      </div>
      <ADiv
        style={{
          width: 100,
          height: 100,
          backgroundColor: aleft.interpolate({
            inputRange: [0, 500],
            outputRange: ["red", "black"],
          }),
          position: "relative",
          left: aleft,
        }}
      />
    </>
  );
}

export default App;
