import { defineStore } from 'pinia';

export const useBoardStorage = defineStore('board', {
    state: () => ({
        boardData: null,
    }),
    actions: {
        setBoardData(data) {
            this.boardData = data;
        },
        clearBoardData() {
            this.boardData = null;
        }
    },
    getters: {
        getBoardData: (state) => state.boardData,
    },
    persist: true,
});