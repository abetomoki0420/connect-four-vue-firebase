import { ref, computed, onUnmounted } from "vue"
import {
  CellState,
  checkCellCount,
  checkWin,
  createBoard,
  GameBoard,
  ROWS,
} from "../lib"
import {
  subscribeBoard,
  saveBoard,
  subscribeStatus,
  saveStatus,
} from "../lib/storage"

export const useGame = () => {
  const player = ref<Omit<CellState, "empty">>('yellow')
  const waiting = ref(false)
  const started = ref(false)

  const board = ref(createBoard())
  const setBoard = (_board: GameBoard) => {
    board.value = _board
  }

  const unsubscribe = subscribeBoard(setBoard)
  const unsubscribeStatus = subscribeStatus( async (status) => {
    waiting.value = status.waiting
    started.value = status.started

    if(started.value){
      return
    }

    console.log(player.value, started.value, waiting.value)

    if (status.waiting && player.value === 'yellow') {
      // ゲームを開始する
      await saveStatus({
        waiting: false,
        started: true,
      })
    } else {
      // 次のプレイヤーが参加するまで待機する
      player.value = "red" // 先攻がセットされる
      await saveStatus({
        waiting: true,
        started: false,
      })
    }
  })

  

  window.onbeforeunload = async () => {
    unsubscribe()
    unsubscribeStatus()

    // ユーザーが離脱した時、初期化にする
    saveBoard(createBoard())
    await saveStatus({
      waiting: false,
      started: false,
    })
  }

  const cellCounts = computed(() => {
    return checkCellCount(board.value)
  })

  const selectCol = (colIndex: number) => {
    const row = checkCellCount(board.value)[colIndex]
    if (row >= ROWS) {
      return
    }
    board.value[row][colIndex] = "red"

    saveBoard(board.value)
  }

  const resultStatus = computed(() => {
    return {
      red: checkWin(board.value, "red"),
      yellow: checkWin(board.value, "yellow"),
    }
  })

  return {
    player,
    started,
    waiting,
    cellCounts,
    board,
    selectCol,
    resultStatus,
  }
}
