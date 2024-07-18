import { useEffect, useMemo, useRef } from "react";
const CV_WIDTH = 1440;
const CV_HEIGHT = 810;

export default function Canvas({ frame }) {
  const CELL_SIZE = CV_HEIGHT / frame.height;

  const ref = useRef(null);

  const ctx = useMemo(
    () => (ref.current ? ref.current?.getContext?.("2d") : null),
    [ref.current]
  );

  useEffect(() => {
    if (ctx) {
      clearCanvas();
      drawNet();

      function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, CV_WIDTH, CV_HEIGHT);
      }
      function drawNet() {
        setStyle();

        for (let index = 0; index < frame.height; index++)
          drawVerticalLine(index);
        for (let index = 0; index < frame.width; index++)
          drawHorizontalLine(index);

        function setStyle() {
          ctx.strokeStyle = "gray";
          ctx.lineWidth = 0.1;
        }
        function drawHorizontalLine(colIndex) {
          drawLine(
            [colIndex * CELL_SIZE, 0],
            [colIndex * CELL_SIZE, CV_HEIGHT]
          );
        }

        function drawVerticalLine(rowIndex) {
          drawLine([0, rowIndex * CELL_SIZE], [CV_WIDTH, rowIndex * CELL_SIZE]);
        }

        function drawLine(from, to) {
          ctx.beginPath();
          ctx.moveTo(...from);
          ctx.lineTo(...to);
          ctx.stroke();
        }
      }
    }
  }, [ctx]);

  useEffect(() => {
    if (ctx) {
      fillAliveCells();
      function fillAliveCells() {
        drawAliceCells((...args) => drawCell(...args, "blue"));
      }
    }

    function drawAliceCells(drawCell) {
      for (let rowIndex = 0; rowIndex < frame.height; rowIndex++) {
        for (let colIndex = 0; colIndex < frame.width; colIndex++) {
          let value = frame.rows[rowIndex][colIndex];
          if (value) drawCell(ctx, rowIndex, colIndex);
        }
      }
    }
    function drawCell(ctx, rowIndex, colIndex, color) {
      ctx.fillStyle = color;
      ctx.fillRect(
        colIndex * CELL_SIZE + 1,
        rowIndex * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    }

    return () => {
      if (ctx) {
        clearAliveCells();
        function clearAliveCells() {
          drawAliceCells((...args) => drawCell(...args, "white"));
        }
      }
    };
  }, [frame]);
  return (
    <div className="shadow-2xl bg-white rounded-xl overflow-hidden">
      <canvas
        ref={ref}
        id="canvas"
        className="border w-full "
        width={CV_WIDTH}
        height={CV_HEIGHT}
      ></canvas>
    </div>
  );
}
