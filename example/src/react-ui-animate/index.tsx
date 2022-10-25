import { useState } from "react";
import { animated } from "fluid-motion";

import { useMountedValue } from "./useMountedValue";
import { withSpring, withTiming } from "./animations";

function App() {
  const [open, setOpen] = useState(false);
  const mv = useMountedValue(open, {
    from: 0,
    enter: withSpring(200, { friction: 10, tension: 300 }, (result) => {
      console.log("ANIMATION COMPLETE", result);
    }),
    exit: withTiming(0, { duration: 5000 }),
  });

  return (
    <>
      <button onClick={() => setOpen((prev) => !prev)}>SHOW / HIDE</button>
      {mv(
        (translateX, mounted) =>
          mounted && (
            <animated.div
              style={{
                touchAction: "none",
                width: 100,
                height: 100,
                background: "#3399ff",
                translateX: translateX.value,
              }}
            />
          )
      )}
    </>
  );
}

export default App;
