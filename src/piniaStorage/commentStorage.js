import { defineStore } from 'pinia';
import api from "@/api.js";

export const useCommentStorage = defineStore('comment', {
    state: () => ({
        commentData: null,
    }),
    actions: {
        setCommentData(data) {
            this.commentData = data;
        },
        clearCommentData() {
            this.commentData = null;
        },
        async setNewCommentData(pid) {
            try {
                const response = await api.get(`/community/board/post/${pid}/comment`);
                console.log(response.data)
                this.postData = response.data;
            } catch (error) {
                console.log(error);
            }
        }
    },
    getters: {
        getCommentData: (state) => state.commentData,
    },
    persist: true,
});