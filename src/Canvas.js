import { useEffect } from "react";
const CV_WIDTH = 1440;
const CV_HEIGHT = 810;

export default function Canvas({ frame }) {
  const CELL_SIZE = CV_HEIGHT / frame.height;

  useEffect(() => {
      let cv = document.querySelector("canvas");
      const ctx = cv && cv.getContext && cv.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, CV_WIDTH, CV_HEIGHT);
          drawNet();

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
            ctx.beginPath();
            ctx.moveTo(colIndex * CELL_SIZE, 0);
            ctx.lineTo(colIndex * CELL_SIZE, CV_HEIGHT);
            ctx.stroke();
          }

          function drawVerticalLine(rowIndex) {
            ctx.beginPath();
            ctx.moveTo(0, rowIndex * CELL_SIZE);
            ctx.lineTo(CV_WIDTH, rowIndex * CELL_SIZE);
            ctx.stroke();
          }
        }
      }
  }, [CELL_SIZE]);

  useEffect(() => {
    let cv = document.querySelector("canvas");
    const ctx = cv && cv.getContext && cv.getContext("2d");

    if (ctx) {
      drawCells(ctx);

      function drawCells() {
        for (let rowIndex = 0; rowIndex < frame.height; rowIndex++) {
          for (let colIndex = 0; colIndex < frame.width; colIndex++) {
            let value = frame.rows[rowIndex][colIndex];
            if (value) drawCell(ctx, rowIndex, colIndex);
          }
        }

        function drawCell(ctx, rowIndex, colIndex) {
          ctx.fillStyle = "blue";
          ctx.fillRect(
            colIndex * CELL_SIZE + 1,
            rowIndex * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
          );
        }
      }
    }

    return () => {
      if (ctx) {
        drawCells();
        function drawCells() {
          for (let rowIndex = 0; rowIndex < frame.height; rowIndex++) {
            for (let colIndex = 0; colIndex < frame.width; colIndex++) {
              let value = frame.rows[rowIndex][colIndex];
              if (value) drawCell(ctx, rowIndex, colIndex);
            }
          }
          function drawCell(ctx, rowIndex, colIndex) {
            ctx.fillStyle = "white";
            ctx.fillRect(
              colIndex * CELL_SIZE + 1,
              rowIndex * CELL_SIZE + 1,
              CELL_SIZE - 2,
              CELL_SIZE - 2
            );
          }
        }
      }
    };
  }, [frame]);
  return (
    <div className="shadow-2xl bg-white rounded-xl overflow-hidden">
      <canvas
        id="canvas"
        className="border w-full "
        width={CV_WIDTH}
        height={CV_HEIGHT}
      ></canvas>
    </div>
  );
}
