import { defineStore } from 'pinia';

export const useQuestionSelectStorage = defineStore('questionSelect', {
    state: () => ({
        questionSelectData: null,
    }),
    actions: {
        setQuestionSelectData(data) {
            this.questionSelectData = data;
        },
        clearQuestionSelectData() {
            this.questionSelectData = null;
        }
    },
    getters: {
        getQuestionSelectData: (state) => state.questionSelectData,
    },
    persist: true,
});