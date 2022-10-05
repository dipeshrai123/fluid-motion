import { createAnimatedComponent, AnimatedValue, spring } from "fluid-motion";
import { useRef } from "react";

const ADiv = createAnimatedComponent("div");

function App() {
  const aleft = useRef(new AnimatedValue(0)).current;

  return (
    <>
      <div
        onClick={() => spring(aleft, { toValue: 500 }).start()}
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
        ref={(re) => console.log(re)}
        style={{
          width: aleft.interpolate({
            inputRange: [0, 500],
            outputRange: [100, 200],
          }),
          height: 100,
          backgroundColor: "#3399ff",
          position: "relative",
          left: aleft,
          display: "flex",
        }}
      />
    </>
  );
}

export default App;
