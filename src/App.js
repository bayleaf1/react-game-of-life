import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { generateInitialFrame, calculateNextFrame, testing } from "./gameOfLife";
import Canvas from "./Canvas";
import ControlPanel from "./ControlPanel";

let interval = null;
const initialSize = [160, 90];

function App() {
  // testing();
  const [speed, setSpeed] = useState(0.75);
  const [debouncedSpeed] = useDebounce(speed, 300);
  const [frame, setFrame] = useState(() =>
    generateInitialFrame(...initialSize)
  );

  useEffect(() => {
    interval = setTimeout(() => {
      setFrame(calculateNextFrame(frame));
    }, 1000 *  (1 - debouncedSpeed));

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [frame, debouncedSpeed]);

  const onRestart = () => {
    setFrame(generateInitialFrame(...initialSize));
  };

  const onChangeSpeed = (v) => setSpeed(v);


  return (
    <div className="max-w-[1440px] px-10 pt-2 flex flex-col items-center gap-4 mx-auto">
      <p className="text-2xl font-semibold">Game of life 2.</p>
      <ControlPanel
        {...{
          speed,
          frame,
          onChangeSpeed,
          onRestart,
        }}
      />

      <Canvas frame={frame}/>
    </div>
  );
}

export default App;
