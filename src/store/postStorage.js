import { defineStore } from 'pinia';
import api from "@/services/api.js";

export const usePostStorage = defineStore('post', {
    state: () => ({
        postData: null,
    }),
    actions: {
        setPostData(data) {
            this.postData = data;
        },
        clearPostData() {
            this.postData = null;
        },
        async setNewPostData(pid) {
            try {
                const response = await api.get(`/community/board/post/${pid}`);
                console.log(response.data)
                this.postData = response.data;
            } catch (error) {
                console.log(error);
            }
        }
    },
    getters: {
        getPostData: (state) => state.postData,
    },
    persist: true,
});