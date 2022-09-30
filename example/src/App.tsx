import { AnimatedValue, timing } from "fluid-motion";
import { useEffect, useRef } from "react";

function App() {
  const divRef = useRef<any>(null);
  const animation = useRef(new AnimatedValue(10)).current;

  useEffect(() => {
    animation.addListener((v) => {
      divRef.current.style.left = v.value + "px";
    });
  }, [animation]);

  return (
    <div
      ref={divRef}
      onClick={() => timing(animation, { toValue: 500 }).start()}
      style={{
        width: 100,
        height: 100,
        backgroundColor: "red",
        position: "relative",
      }}
    />
  );
}

export default App;
