<template>
  <div class="container font-nanum-gothic-regular">
    <h1 class="mt-4">글 수정</h1>

    <div class="card mb-4">
      <div class="card-body">
        <form @submit.prevent="updatePost">
          <!-- 글 제목 입력 -->
          <div class="mb-3">
            <label for="title" class="form-label">글 제목</label>
            <input
                type="text"
                id="title"
                v-model="title"
                class="form-control"
            />
          </div>

          <!-- 본문 입력 -->
          <div class="mb-3">
            <label for="content" class="form-label">본문</label>
            <textarea
                id="content"
                v-model="content"
                class="form-control"
                rows="10"
                style="height: 500px"
            ></textarea>
          </div>

          <!-- 수정 및 취소 버튼 -->
          <button type="submit" class="btn btn-primary">
            수정
          </button>
          <button type="button" @click="cancelEdit" class="btn btn-outline-secondary">
            취소
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePostStorage } from "@/store/postStorage";
import api from "@/services/api";

const router = useRouter();
const postDetailStorage = usePostStorage();
const postData = postDetailStorage.getPostData;

const title = ref(postData.post.title ?? "");
const content = ref(postData.post.content ?? "");

const updatePost = async () => {
  try {
    const payload = {
      title: title.value,
      content: content.value,
      qid: postData.post.question?.qid || null,
    };

    const response = await api.put(`/community/board/post/${postData.post.pid}`, payload);

    postDetailStorage.setPostData(response.data);

    // 성공하면 수정된 글 상세로 이동
    await router.replace({ path: `/board/post/${postData.post.pid}` });
  } catch (error) {
    console.error("글 수정 실패:", error);
    alert("글 수정에 실패했습니다. 다시 시도해 주세요.");
  }
};

const cancelEdit = () => {
  router.back();
};
</script>