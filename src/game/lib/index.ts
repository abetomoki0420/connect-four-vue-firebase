import * as z from "zod"
import * as R from "remeda"

export const gameBoardSchema = z.array(
  z.array(
    z.union([
      z.literal('empty'),
      z.literal('red'),
      z.literal('yellow'),
    ])
  )
)

export const gameStatusSchema = z.object({
  turn: z.boolean(),
  waiting: z.boolean(),
  started: z.boolean(),
})

export type GameBoard = z.infer<typeof gameBoardSchema>
export type CellState = GameBoard[number][number]

export type GameStatus = z.infer<typeof gameStatusSchema>

export const ROWS = 6
export const COLS = 7

export const createBoard = () => { 
  const board: CellState[][] = new Array(ROWS);
  for (let row = 0; row < ROWS; row++) {
    board[row] = new Array(COLS).fill("empty");
  }
  return board
}

export const checkWin = (board: CellState[][], color: CellState): boolean => {
  // Check for horizontal wins
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      if (
        board?.[row]?.[col] === color &&
        board?.[row]?.[col + 1] === color &&
        board?.[row]?.[col + 2] === color &&
        board?.[row]?.[col + 3] === color
      ) {
        return true
      }
    }
  }

  // Check for vertical wins
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col < COLS; col++) {
      if (
        board?.[row]?.[col] === color &&
        board?.[row + 1]?.[col] === color &&
        board?.[row + 2]?.[col] === color &&
        board?.[row + 3]?.[col] === color
      ) {
        return true
      }
    }
  }

  // Check for diagonal wins (positive slope)
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      if (
        board?.[row]?.[col] === color &&
        board?.[row + 1]?.[col + 1] === color &&
        board?.[row + 2]?.[col + 2] === color &&
        board?.[row + 3]?.[col + 3] === color
      ) {
        return true
      }
    }
  }

  // Check for diagonal wins (negative slope)
  for (let row = 0; row <= ROWS; row++) {
    for (let col = 3; col < COLS; col++) {
      if (
        board?.[row]?.[col] === color &&
        board?.[row + 1]?.[col - 1] === color &&
        board?.[row + 2]?.[col - 2] === color &&
        board?.[row + 3]?.[col - 3] === color
      ) {
        return true
      }
    }
  }
  // No win found
  return false
}

export const checkCellCount = (board: GameBoard) => {
  return R.map.indexed( board[0], (_col, i) => {
    return R.pipe(board,
      R.map((row) => row[i]),
      R.countBy( (cell) => cell !== 'empty' )
      )
  })
}