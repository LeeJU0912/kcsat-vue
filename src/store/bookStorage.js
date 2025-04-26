import { defineStore } from 'pinia';

export const useBookStorage = defineStore('book', {
    state: () => ({
        bookData: null,
    }),
    actions: {
        setBookData(data) {
            this.bookData = data;
        },
        clearBookData() {
            this.bookData = null;
        }
    },
    getters: {
        getBookData: (state) => state.bookData,
    },
    persist: true,
});