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
import A from "animated";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

const ADiv = createAnimatedComponent("div");
const BDiv = A.createAnimatedComponent("div");

function App() {
  const aleft = useRef(new AnimatedValue(0)).current;
  const aleftFollow = useRef(new AnimatedValue(0)).current;
  const bleft = useRef(new A.Value(0)).current;
  const bleftFollow = useRef(new A.Value(0)).current;

  const bind = useDrag(({ movement: [mx] }) => {
    spring(aleft, { toValue: mx }).start();
    spring(aleftFollow, { toValue: aleft }).start();
    A.spring(bleft, { toValue: mx }).start();
    A.spring(bleftFollow, { toValue: bleft }).start();
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
          backgroundColor: aleft.interpolate({
            inputRange: [0, 1],
            outputRange: ["red", "black"],
          }),
          position: "relative",
          left: aleft,
        }}
      />
      <ADiv
        style={{
          width: 100,
          height: 100,
          backgroundColor: "#3399ff",
          position: "relative",
          left: aleftFollow,
        }}
      />
      <BDiv
        style={{
          width: 100,
          height: 100,
          backgroundColor: bleft.interpolate({
            inputRange: [0, 1],
            outputRange: ["red", "black"],
          }),
          position: "relative",
          left: bleft,
        }}
      />
      <BDiv
        style={{
          width: 100,
          height: 100,
          backgroundColor: "#3399ff",
          position: "relative",
          left: bleftFollow,
        }}
      />
    </>
  );
}

export default App;
