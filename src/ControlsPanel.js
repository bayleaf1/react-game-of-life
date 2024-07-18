import { ReloadOutlined } from "@ant-design/icons";
import { Button, Slider } from "antd";

export default function ControlsPanel({
  onRestart,
  onChangeSpeed,
  width,
  onChangeSize,
  speed,
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
      <div className={"flex flex-col"}>
        <p className="text-xs font-medium">Size</p>
        <Slider
          min={62}
          step={9}
          max={215}
          className="w-20"
          onChange={onChangeSize}
          value={width}
        />
      </div>
    </div>
  );
}
