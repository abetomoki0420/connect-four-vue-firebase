import { ref, computed } from "vue"
import {
  CellState,
  checkCellCount,
  checkWin,
  createBoard,
  GameBoard,
  GameStatus,
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
  
  const status = ref<GameStatus>({
    turn: true,
    waiting: false,
    started: false
  })

  const board = ref(createBoard())
  const setBoard = (_board: GameBoard) => {
    board.value = _board
  }

  const unsubscribe = subscribeBoard(setBoard)
  const unsubscribeStatus = subscribeStatus( async (s) => {
    status.value = s

    if(status.value.started){
      return
    }

    if (status.value.waiting && player.value === 'yellow') {
      // ゲームを開始する
      await saveStatus({
        ...status.value,
        waiting: false,
        started: true,
      })
    } else {
      // 次のプレイヤーが参加するまで待機する
      player.value = "red" // 先攻がセットされる
      await saveStatus({
        ...status.value,
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
      turn: true,
      waiting: false,
      started: false,
    })
  }

  const cellCounts = computed(() => {
    return checkCellCount(board.value)
  })

  const selectCol = (colIndex: number) => {
    if(gameset.value){
      return
    }

    if(player.value === 'empty'){
      return
    }

    if(player.value === 'yellow' && status.value.turn ){
      return
    }

    if(player.value === 'red' && !status.value.turn ){
      return
    }
    

    const row = checkCellCount(board.value)[colIndex]
    if (row >= ROWS) {
      return
    }
    board.value[row][colIndex] = player.value

    saveBoard(board.value)
    saveStatus({
      ...status.value,
      turn: !status.value.turn
    })
  }

  const resultStatus = computed(() => {
    return {
      red: checkWin(board.value, "red"),
      yellow: checkWin(board.value, "yellow"),
    }
  })

  const gameset = computed( () => {
    return resultStatus.value.red || resultStatus.value.yellow
  })


  return {
    player,
    status,
    cellCounts,
    board,
    selectCol,
    resultStatus,
    gameset
  }
}
