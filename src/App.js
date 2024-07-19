import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { generateInitialFrame, calculateNextFrame, testing } from "./gameOfLife";
import Canvas from "./Canvas";
import ControlPanel from "./ControlPanel";

let interval = null;
const initialSize = [160, 90];

function App() {
  // testing();
  const [speed, setSpeed] = useState(1);
  const [debouncedSpeed] = useDebounce(speed, 700);
  const [generation, setGeneration] = useState(1)
  const [frame, setFrame] = useState(() =>
    generateInitialFrame(...initialSize)
  );

  useEffect(() => {
    interval = setTimeout(() => {
      setFrame(calculateNextFrame(frame));
      setGeneration(s=>s+1)
    }, 1000 *  (1.01 - debouncedSpeed));

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [frame, debouncedSpeed]);

  const onRestart = () => {
    setFrame(generateInitialFrame(...initialSize));
    setGeneration(1)
  };

  const onChangeSpeed = (v) => setSpeed(v);


  return (
    <div className="max-w-[1440px] px-10 pt-2 flex flex-col items-center gap-4 mx-auto">
      <p className="text-2xl font-semibold">Game of life <a target="_blank" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" className="underline text-sm ml-4 text-amber-800" >Wiki</a></p>
      <ControlPanel
        {...{
          speed,
          frame,
          onChangeSpeed,
          onRestart,
          generation,
          population: frame.population,
        }}
      />

      <Canvas frame={frame}/>
    </div>
  );
}

export default App;
