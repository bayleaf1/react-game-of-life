import _ from "lodash";

export function generateInitialFrame(width, height) {
  return generateFrame(width, height, () => (Math.random() > 0.94 ? 1 : 0));

  function generateFrame(width, height, getValue = () => 0) {
    let data = new Array(height)
      .fill("")
      .map((_v, rI) =>
        new Array(width).fill("").map((_v, cI) => new Cell(getValue(), rI, cI))
      );

    return new Frame(data).toRaw();
  }
}

export function calculateNextFrame(currentRawFrame) {
  const currentFrame = Frame.fromRawFrame(currentRawFrame);
  const rule = new Ruler(new Inspector(currentFrame));

  const nextFrame = new Frame([]);

  currentFrame.traverse((cell) =>
    nextFrame.insert(rule.cellForNextGeneration(cell))
  );

  return nextFrame.toRaw();
}

class Frame {
  constructor(rowsWithCells = [[]]) {
    this.data = rowsWithCells;
  }

  traverse(cb = (cell) => "") {
    this.data.forEach((row, rIdx) =>
      row.forEach((cell, cIdx) => cb(cell, rIdx, cIdx))
    );
  }

  insert(cell) {
    return _.set(this.data, `[${cell.rowIndex()}][${cell.colIndex()}]`, cell);
  }

  getCellAt(rowIdx, colIdx) {
    return _.get(this.data, `[${rowIdx}][${colIdx}]`, null);
  }

  toArraysWithNumbers() {
    return this.data.map((r) => r.map((cell) => cell.value()));
  }

  toRaw() {
    return {
      width: _.get(this.data, "[0]", []).length,
      height: _.get(this.data, "length", 0),
      rows: this.toArraysWithNumbers(),
    };
  }

  static fromArraysWithNumbers(data = [[]]) {
    data = data.map((r, rI) => r.map((value, cI) => new Cell(value, rI, cI)));
    return new Frame(data);
  }

  static fromRawFrame(frame = {}) {
    let data = frame.rows.map((r, rI) =>
      r.map((value, cI) => new Cell(value, rI, cI))
    );
    return new Frame(data);
  }
}

class Cell {
  constructor(value, rowIndex, colIndex) {
    this._value = value;
    this._colIndex = colIndex;
    this._rowIndex = rowIndex;
  }

  colIndex() {
    return this._colIndex;
  }

  rowIndex() {
    return this._rowIndex;
  }
  value() {
    return this._value;
  }

  isAlive() {
    return this._value === 1;
  }
  isDead() {
    return this._value === 0;
  }

  static dead(rowIdx = 0, colIdx = 0) {
    return new Cell(0, rowIdx, colIdx);
  }
  static alive(rowIdx = 0, colIdx = 0) {
    return new Cell(1, rowIdx, colIdx);
  }
}

class Inspector {
  constructor(frame) {
    this.frame = frame;
  }

  countAliveNeighbours(cell) {
    const neighbours = {
      topLeft: this._neighbourCell(cell, -1, -1),
      top: this._neighbourCell(cell, -1, 0),
      topRight: this._neighbourCell(cell, -1, 1),
      right: this._neighbourCell(cell, 0, 1),
      bottomRight: this._neighbourCell(cell, 1, 1),
      bottom: this._neighbourCell(cell, 1, 0),
      bottomLeft: this._neighbourCell(cell, 1, -1),
      left: this._neighbourCell(cell, 0, -1),
    };
    return Object.values(neighbours).filter((cell) => cell.isAlive()).length;
  }

  _neighbourCell(cell, rowOffset, colOffset) {
    const nbCell = this.frame.getCellAt(
      cell.rowIndex() + rowOffset,
      cell.colIndex() + colOffset
    );
    return nbCell || Cell.dead();
  }
}

class Ruler {
  constructor(inspector) {
    this.inspector = inspector;
  }

  cellForNextGeneration(cell) {
    const aliveNeighbours = this.inspector.countAliveNeighbours(cell);
    let create = Cell.dead;

    if (cell.isAlive()) {
      let shouldBeAlive = aliveNeighbours > 1 && aliveNeighbours < 4;
      if (shouldBeAlive) create = Cell.alive;
    }

    if (cell.isDead()) {
      let shouldBeAlive = aliveNeighbours >= 3;
      if (shouldBeAlive) create = Cell.alive;
    }

    return create(cell.rowIndex(), cell.colIndex());
  }
}

export function testing() {
  console.clear();

  test(
    "cell dies when 4 nb",
    [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]
  );
  test(
    "cell alive when 3 nb",
    [
      [1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]
  );

  test(
    "cell survives when 3 nb",
    [
      [1, 0, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]
  );
  test(
    "cell survives when 2 nb",
    [
      [1, 0, 0],
      [0, 1, 0],
      [1, 0, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]
  );
  test(
    "cell dies when 1 nb",
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
  );
  test(
    "cell dies when no nb",
    [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
  );
  test(
    "null",
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
  );
  test("default", [[]], []);

  return;
  function test(msg, current, expected) {
    let result = calculateNextFrame(
      Frame.fromArraysWithNumbers(current).toRaw()
    );
    let passed =
      JSON.stringify(result.rows, null, 2) ===
      JSON.stringify(expected, null, 2);
    console.log(
      msg,
      passed
        ? "✅"
        : "❌\n" + result.rows.map((r) => r.map((v) => v + " ")).join("\n")
    );
  }
}
