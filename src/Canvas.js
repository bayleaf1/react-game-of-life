import { useEffect } from "react";
const CV_WIDTH = 1440;
const CV_HEIGHT = 810;

export default function Canvas({ frame }) {
  useEffect(() => {
    const CELL_SIZE = CV_HEIGHT / frame.height;
    let cv = document.querySelector("canvas");
    const ctx = cv && cv.getContext && cv.getContext("2d");

    if (ctx) {
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
          ctx.strokeStyle = "gray";
          ctx.lineWidth = 0.1;
          ctx.beginPath();
          ctx.moveTo(0, rowIndex * CELL_SIZE);
          ctx.lineTo(CV_WIDTH, rowIndex * CELL_SIZE);
          ctx.stroke();
        }
      }
    }
  }, [frame.width, frame.length]);

  useEffect(() => {
    const CELL_SIZE = CV_HEIGHT / frame.height;
    let cv = document.querySelector("canvas");
    const ctx = cv && cv.getContext && cv.getContext("2d");

    if (ctx) {
      //   drawNet();
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
          ctx.strokeStyle = "white";
          ctx.lineWidth = 0.7;
          ctx.strokeRect(
            colIndex * CELL_SIZE,
            rowIndex * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          );
          ctx.fillRect(
            colIndex * CELL_SIZE,
            rowIndex * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
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
            ctx.fillStyle = "blue";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 0.7;
            ctx.strokeRect(
              colIndex * CELL_SIZE,
              rowIndex * CELL_SIZE,
              CELL_SIZE,
              CELL_SIZE
            );
            ctx.fillRect(
              colIndex * CELL_SIZE,
              rowIndex * CELL_SIZE,
              CELL_SIZE,
              CELL_SIZE
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
