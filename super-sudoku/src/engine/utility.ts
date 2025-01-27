import {chain, groupBy, keys, pickBy, sortBy, values} from "lodash";
import {SimpleSudoku, ComplexSudoku, Cell} from "./types";
export const SUDOKU_COORDINATES = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const SUDOKU_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// SQUARE TABLE
/*
    _x = 0       _x = 1     _x = 2
.-----0-----------1----------2------|
|   x < 3   | 3 < x < 6 |   x > 6   |  _y = 0
|   y < 3   | y < 3     |   y < 3   |
|-----3-----------4----------5------|
|   x < 3   | 3 < x < 6 |   x > 6   |  _y = 1
| 3 < y < 6 | 3 < y < 6 | 3 < y < 6 |
.-----6-----------7----------8------|
|   x < 3   | 3 < x < 6 |   x > 6   |  _y = 2
|   y > 6   | y > 6     |   y > 6   |
|-----------------------------------|
square = _y * 3 + _x;
*/
export const SQUARE_TABLE = (function () {
  const cells: Array<[number, number]> = ([] as Array<[number, number]>).concat(
    ...SUDOKU_COORDINATES.map((x) => {
      return SUDOKU_COORDINATES.map((y) => {
        return [x, y] as [number, number];
      });
    }),
  );
  const grouped = groupBy(cells, ([x, y]) => {
    return Math.floor(y / 3) * 3 + Math.floor(x / 3);
  });
  // we sort them, so we can use an optimization
  const squares = sortBy(keys(grouped), (k) => k).map((k) => sortBy(grouped[k], ([x, y]) => `${y}-${x}`));
  return squares;
})();

export function squareIndex(x: number, y: number): number {
  return Math.floor(y / 3) * 3 + Math.floor(x / 3);
}

export function printSimpleSudoku(grid: SimpleSudoku) {
  return grid
    .map((row) => {
      return row.map((c) => (c === 0 ? "_" : "" + c)).join("");
    })
    .join("\n");
}

export function duplicates(array: number[]): number {
  const filtered = array.filter((c) => c !== 0);
  const grouped = groupBy(filtered, (c) => c);
  const picked = pickBy(grouped, (x) => x.length > 1);
  return values(picked).length;
}

export function simpleSudokuToComplexSudoku(grid: SimpleSudoku): ComplexSudoku {
  return ([] as ComplexSudoku).concat(
    ...grid.map((row, y) => {
      return row.map((n, x) => {
        return {
          x,
          y,
          number: n,
        };
      });
    }),
  );
}

export function simpleSudokuToCells(grid: SimpleSudoku, solution?: SimpleSudoku): Cell[] {
  return ([] as Cell[]).concat(
    ...grid.map((row, y) => {
      return row.map((n, x) => {
        return {
          x,
          y,
          number: n,
          notes: [],
          initial: n !== 0,
          solution: solution ? solution[y][x] : 0,
        };
      });
    }),
  );
}

export function complexSudokuToSimpleSudoku(sudoku: ComplexSudoku): SimpleSudoku {
  const simple: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  sudoku.forEach((cell) => {
    simple[cell.y][cell.x] = cell.number;
  });
  return simple;
}

export function parseSudoku(sudoku: string): SimpleSudoku {
  // check if the input-data is correct
  const inputDataIsCorrectDomain = [...sudoku].every((char) => {
    return ["\n", "_"].concat(SUDOKU_NUMBERS.map((n) => String(n))).indexOf(char) >= 0;
  });

  if (!inputDataIsCorrectDomain) {
    throw new Error("The input data is incorrect, only _, \n and 1...9 allowed");
  }

  const lines = sudoku.split("\n");

  if (lines.length !== 9) {
    throw new Error(`Wrong number of lines! Only 9 allowed: ${sudoku}`);
  }

  return lines.map((line) => {
    const characters = line.split("");
    if (characters.length !== 9) {
      throw new Error(`Wrong number of characters in line! Only 9 allowed: ${line} - ${sudoku}`);
    }
    return characters.map((c) => {
      const number = c === "_" ? 0 : Number(c);
      return number;
    });
  });
}

export function printComplexSudoku(grid: ComplexSudoku) {
  return chain(grid)
    .groupBy((c) => {
      return c.y;
    })
    .toPairs()
    .sortBy(([, k]) => k)
    .map(([, cells]: [string, ComplexSudoku]) => {
      return sortBy(cells, (c) => c.x)
        .map((c) => {
          return c.number === 0 ? "_" : String(c.number);
        })
        .join("");
    })
    .join("\n");
}
