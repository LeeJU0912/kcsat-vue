import { defineStore } from 'pinia';

export const useQuestionStorage = defineStore('question', {
    state: () => ({
        questionData: null,
    }),
    actions: {
        setQuestionData(data) {
            this.questionData = data;
        },
        clearQuestionData() {
            this.questionData = null;
        }
    },
    getters: {
        getQuestionData: (state) => state.questionData,
    },
    persist: true,
});