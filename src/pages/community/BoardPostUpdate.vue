<template>
  <div>
    <div class="container font-nanum-gothic-regular">
      <h1 class="mt-4">글 수정</h1>
      <div class="card mb-4">
        <div class="card-body">
          <form @submit.prevent="updatePost">
            <!-- 글 제목 입력 -->
            <div class="mb-3">
              <label for="title" class="form-label">글 제목</label>
              <input type="text" class="form-control" id="title" v-model="title">
            </div>

            <!-- 본문 입력 -->
            <div class="mb-3">
              <label for="content" class="form-label">본문</label>
              <textarea class="form-control" id="content" v-model="content" rows="10" style="height: 500px"></textarea>
            </div>

            <!-- 수정 및 취소 버튼 -->
            <button type="submit" class="btn btn-primary">수정</button>
            <button type="button" @click="cancelEdit" class="btn btn-outline-secondary">취소</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api.js";
import {usePostStorage} from "@/piniaStorage/postStorage.js";
import {useRouter} from "vue-router";
import {ref} from "vue";

export default {
  setup() {
    const router = useRouter();
    const postDetailStorage = usePostStorage();
    const postData = postDetailStorage.getPostData;

    const title = ref("");
    title.value = postData.post.title;
    const content = ref("");
    content.value = postData.post.content;


    const updatePost = async () => {
      try {
        const data = {
          title: title.value,
          content: content.value,
          qid: postData.post.question === null ? null : postData.post.question.qid,
        }
        const response = await api.put(`/community/board/post/${postData.post.pid}`, data);

        postDetailStorage.setPostData(response);

        // // 요청 성공 시 페이지 이동
        // await router.replace({
        //   path: `/board/post/${postData.post.pid}`,
        // })

        router.back();
      } catch (error) {
        console.log(error);
      }
    }

    const cancelEdit = () => {
      router.back();
    }

    return {
      title,
      content,
      postData,
      updatePost,
      cancelEdit,
    }
  }
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>
