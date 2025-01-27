import * as _ from "lodash";
import {SUDOKU_NUMBERS, SQUARE_TABLE, squareIndex, duplicates, printSimpleSudoku} from "./utility";
import {SimpleSudoku} from "./types";

function isFilled(grid: SimpleSudoku): boolean {
  return grid.every((row) => row.every((n) => n !== 0));
}

function isCorrect(rows: SimpleSudoku, columns: SimpleSudoku, squares: SimpleSudoku): boolean {
  const duplicatesInRow = rows.some((row) => {
    return duplicates(row) !== 0;
  });
  if (duplicatesInRow) {
    return false;
  }
  const duplicatesInColumns = columns.some((column) => {
    return duplicates(column) !== 0;
  });
  if (duplicatesInColumns) {
    return false;
  }
  const duplicatesInSquares = squares.some((square) => {
    return duplicates(square) !== 0;
  });
  if (duplicatesInSquares) {
    return false;
  }
  return true;
}

function getColumns(grid: SimpleSudoku): SimpleSudoku {
  const columns: SimpleSudoku = [];
  // calculate the duplicates for every column
  for (let x = 0; x < 9; x++) {
    const column: number[] = [];
    for (let y = 0; y < 9; y++) {
      const cell = grid[y][x];
      column.push(cell);
    }
    columns[x] = column;
  }
  return columns;
}

function getSquares(grid: SimpleSudoku): SimpleSudoku {
  const squares: SimpleSudoku = [];
  // calculate the duplicates in every square
  for (let s = 0; s < 9; s++) {
    const square = SQUARE_TABLE[s];
    const squareValues: number[] = [];
    for (let xy = 0; xy < 9; xy++) {
      const [x, y] = square[xy];
      squareValues.push(grid[y][x]);
    }
    squares[s] = squareValues;
  }
  return squares;
}

function getMinimumRemainingValue(
  grid: SimpleSudoku,
  rows: SimpleSudoku,
  columns: SimpleSudoku,
  squares: SimpleSudoku,
) {
  const numberOfRemainingValuesForEveryCell: Array<{
    x: number;
    y: number;
    remainingValues: number[];
  }> = [];

  // find minimum remaining value
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (grid[y][x] === 0) {
        const row = rows[y];
        const column = columns[x];
        const square = squares[squareIndex(x, y)];
        const numbers = row.concat(column).concat(square);
        const remainingValues = SUDOKU_NUMBERS.filter((i) => {
          return numbers.indexOf(i) === -1;
        });
        numberOfRemainingValuesForEveryCell.push({
          x,
          y,
          remainingValues,
        });
      }
    }
  }

  const sortedRemainingValues = _.sortBy(numberOfRemainingValuesForEveryCell, (c) => c.remainingValues.length);
  return sortedRemainingValues[0];
}

function createNewGrids(grid: SimpleSudoku, x: number, y: number, values: number[]) {
  const newGrids = values.map((number) => {
    return grid.map((row, i) => {
      // save some memory
      if (y === i) {
        const newRow = row.slice();
        newRow[x] = number;
        return newRow;
      }
      return row;
    });
  });
  return newGrids;
}

const MAX_ITERATIONS = 3000;

export function _solveGrid(
  stack: SimpleSudoku[] = [],
  iterations: number,
): {
  sudoku: SimpleSudoku | null;
  iterations: number;
} {
  if (stack.length === 0 || iterations > MAX_ITERATIONS) {
    return {
      sudoku: null,
      iterations: Infinity,
    };
  }
  const [grid, ...rest] = stack;
  iterations++;

  const rows = grid;
  const columns = getColumns(grid);
  const squares = getSquares(grid);

  const completelyFilled = isFilled(grid);
  if (completelyFilled) {
    if (isCorrect(rows, columns, squares)) {
      return {
        sudoku: grid,
        iterations,
      };
    }
    return _solveGrid(rest, iterations);
  }

  const {remainingValues, x, y} = getMinimumRemainingValue(grid, rows, columns, squares);
  const newGrids = createNewGrids(grid, x, y, remainingValues);

  return _solveGrid(newGrids.concat(rest), iterations);
}

export function solve(grid: SimpleSudoku) {
  return _solveGrid([grid], 0);
}
