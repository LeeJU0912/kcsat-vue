import api from "@/services/api";
import { usePostStorage } from "@/store/postStorage";
import router from "@/router";

export async function fetchHotBoardPosts(page = 0, keyword = null, type = null) {
    const params = { page, keyword, type };
    const response = await api.get('/community/open/board/hot', { params });
    return response.data;
}

export async function createPost(payload) {
    const response = await api.post("/community/board/post", payload);
    return response.data;
}

export async function moveToPostDetail(pid) {
    try {
        const postStorage = usePostStorage();

        const [postResponse, commentResponse] = await Promise.all([
            api.get(`/community/board/post/${pid}`),
            api.get(`/api/community/board/post/${pid}/comment`),
        ]);

        postStorage.setPostData(postResponse.data);
        postStorage.setCommentData(commentResponse.data);

        await router.replace({ path: `/board/post/${pid}` });
    } catch (error) {
        console.error("Error moving to post detail:", error);
        throw error;
    }
}