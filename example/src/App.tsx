import { createAnimatedComponent, AnimatedValue } from "fluid-motion";

const ADiv = createAnimatedComponent("div");

function App() {
  const opacity = new AnimatedValue(0);

  return (
    <ADiv
      style={{
        width: 100,
        height: 100,
        backgroundColor: "red",
        position: "relative",
        opacity,
      }}
    />
  );
}

export default App;
