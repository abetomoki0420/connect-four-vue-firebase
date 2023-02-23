import { ref, computed, onUnmounted } from "vue"
import { checkCellCount, checkWin, createBoard, GameBoard, ROWS } from "../lib"
import { subscribe, saveBoard } from "../lib/storage"

export const useGame = () => {
  const board = ref(createBoard())
  const setBoard = (_board: GameBoard) => {
    board.value = _board
  }

  const unsubscribe = subscribe(setBoard)
  onUnmounted( () => {
    unsubscribe()
  })

  const cellCounts = computed( () => {
    return checkCellCount(board.value)
  })



  const selectCol = (colIndex: number) => {
    const row = checkCellCount(board.value)[colIndex]
    if(row >= ROWS){
      return
    }
    board.value[row][colIndex] = 'red'

    saveBoard(board.value)
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