import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { generateInitialFrame, calculateNextFrame, testing } from "./frame";
import Canvas from "./Canvas";
import ControlsPanel from "./ControlsPanel";

let interval = null;
function App() {
  const [speed, setSpeed] = useState(0.5);
  const [size, setSize] = useState({ width: 160, height: 90 });
  const [debouncedSpeed] = useDebounce(speed, 300);
  testing();
  const [frame, setFrame] = useState(() =>
    generateInitialFrame(size.width, size.height)
  );

  useEffect(() => {
    interval = setTimeout(() => {
      setFrame(calculateNextFrame(frame));
    }, 1000 * debouncedSpeed);

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [frame, debouncedSpeed]);

  const onRestart = () => {
    setFrame(generateInitialFrame(size.width, size.height));
  };

  const onChangeSpeed = (v) => setSpeed(v);

  const onChangeSize = (width) => {
    let size = { width, height: Math.floor(width / 16) * 9 };
    setSize(size);
    setFrame(generateInitialFrame(size.width, size.height));
  };

  return (
    <div className="max-w-[1440px] px-10 pt-2 flex flex-col items-center gap-4 mx-auto">
      <p className="text-2xl font-semibold">Game of life</p>
      <ControlsPanel
        {...{
          speed,
          frame,
          onChangeSpeed,
          onRestart,
          onChangeSize,
          width: size.width,
        }}
      />

      <Canvas frame={frame} key={size.width} />
    </div>
  );
}

export default App;
