import { createAnimatedComponent, AnimatedValue, spring } from "fluid-motion";
import { useRef } from "react";

const ADiv = createAnimatedComponent("div");

function App() {
  const aleft = useRef(new AnimatedValue(0)).current;
  const aleftfollow = useRef(new AnimatedValue(0)).current;

  return (
    <>
      <div
        onMouseMove={(e) => {
          spring(aleft, { toValue: e.clientX }).start();
          spring(aleftfollow, { toValue: aleft }).start();
        }}
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
          width: aleft.interpolate({
            inputRange: [0, 500],
            outputRange: [100, 200],
          }),
          height: 100,
          backgroundColor: "#3399ff",
          position: "relative",
          left: aleft,
        }}
      />
      <ADiv
        style={{
          width: aleft.interpolate({
            inputRange: [0, 500],
            outputRange: [100, 200],
          }),
          height: 100,
          backgroundColor: "#ff0000",
          position: "relative",
          left: aleftfollow,
        }}
      />
    </>
  );
}

export default App;
