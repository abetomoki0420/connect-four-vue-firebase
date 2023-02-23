import { ref, computed } from "vue"
import { checkCellCount, checkWin, createBoard, GameBoard, ROWS } from "../lib"

export const useGame = () => {
  const board = ref(createBoard())

  const cellCounts = computed( () => {
    return checkCellCount(board.value)
  })

  const setBoard = (_board: GameBoard) => {
    board.value = _board
  }

  const selectCol = (colIndex: number) => {
    const row = checkCellCount(board.value)[colIndex]
    if(row >= ROWS){
      return
    }
    board.value[row][colIndex] = 'red'
  }

  const resultStatus = computed( () => {
    return {
      'red': checkWin(board.value, 'red'),
      'yellow': checkWin(board.value, 'yellow')
    }
  })

  return {
    cellCounts,
    board,
    selectCol,
    resultStatus
  }
}