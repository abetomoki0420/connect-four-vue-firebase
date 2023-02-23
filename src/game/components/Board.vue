<script setup lang="ts">
import { useGame } from "../composables/useGame";
import { ROWS } from "../lib";

const { gameset, player, board, selectCol, cellCounts, resultStatus, status } =
  useGame();
</script>

<template>
  <div v-if="status.waiting">waiting...</div>
  <div v-else class="container">
    <div class="board">
      <div>Your color: {{ player }}</div>
      <div>It is {{ status.turn ? "red" : "yellow" }} turn</div>
      <div v-if="gameset">{{ resultStatus.red ? "red" : "yellow" }} won</div>
      <div v-for="(r, ri) in board" :key="ri" class="row">
        <div
          v-for="(c, ci) in r"
          :key="`${ri}${ci}`"
          class="col"
          :class="board[ROWS - ri - 1][ci]"
          @click="selectCol(ci)"
        >
          <span class="cell"> </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 1rem;
}
.board {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border: 1px solid rgba(1, 1, 1, 0.2);
  padding: 1rem;
  border-radius: 1rem;
}
.row {
  display: flex;
  gap: 0.8rem;
}

.col {
  height: 4rem;
  width: 4rem;
  background: rgba(1, 1, 1, 0.2);
  text-decoration: none;
  user-select: none;
  border-radius: 50%;
  cursor: pointer;
}

.col.red {
  background: tomato;
}

.col.yellow {
  background: yellow;
}
</style>
