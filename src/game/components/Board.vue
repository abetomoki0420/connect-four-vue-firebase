<script setup lang="ts">
import { useGame } from '../composables/useGame';
import { ROWS } from "../lib"

const { board, selectCol, cellCounts, resultStatus } = useGame()

</script>

<template>
  <div class="container">
    <div class="board">
      {{  cellCounts  }}
      {{  resultStatus  }}
      <div v-for="(r, ri) in board" :key="ri" class="row">
        <div v-for="(c, ci) in r" :key="`${ri}${ci}`" class="col" @click="selectCol(ci)">
          <span class="cell">
            {{ board[ROWS - ri - 1][ci] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
  padding: 1rem;
}
.board {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.row {
  display: flex;
  gap: 1rem;
}

.col {
  height: 4rem;
  width: 4rem;
  background: rgba(1,1,1,0.2);
  text-decoration: none;
  user-select: none;
}

</style>