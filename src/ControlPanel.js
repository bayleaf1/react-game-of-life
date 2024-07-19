import { ReloadOutlined } from "@ant-design/icons";
import { Button, Slider } from "antd";

export default function ControlsPanel({
  onRestart,
  onChangeSpeed,
  speed,
  population,
  generation
}) {
  return (
    <div className="flex gap-4 items-center">
      <Button
        onClick={onRestart}
        type="primary"
        title="REstart"
        shape="circle"
        icon={<ReloadOutlined />}
      />
      <div className={"flex flex-col"}>
        <p className="text-xs font-medium">Speed</p>
        <Slider
          min={0.05}
          step={0.03}
          max={1}
          className="w-20"
          onChange={onChangeSpeed}
          value={speed}
        />
      </div>
      <div className="flex flex-col w-36 ">
        <span className="text-sm">Generation: <span className="font-medium">{generation}</span></span>
        <span className="text-sm">Population: &nbsp;<span className="font-medium">{population}</span></span>
      </div>
    </div>
  );
}
