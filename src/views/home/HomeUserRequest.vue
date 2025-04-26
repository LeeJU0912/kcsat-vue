<template>
  <div class="container text-center font-nanum-gothic-regular">
    <h2 class="nav-item font-nanum-gothic-bold">운영자에게 건의 사항</h2>

    <form @submit.prevent="submitRequest">
      <!-- 건의 사항 입력 -->
      <div class="form-group mt-3">
        <textarea
            v-model="content"
            class="form-control mx-auto"
            id="content"
            placeholder="개선하면 좋아질 부분을 적어 주세요! ☺️️"
            rows="5"
        />
      </div>

      <!-- 제출 버튼 -->
      <div class="d-flex justify-content-center mt-2">
        <button type="submit" class="btn btn-primary btn-lg">제출</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import api from "@/services/api";

const content = ref("");

const submitRequest = async () => {
  if (!content.value.trim()) {
    alert("내용을 입력해 주세요!");
    return;
  }

  try {
    await api.post("/community/improving", { content: content.value });

    alert("의견 감사합니다 :)\n앞으로 더욱 발전된 모습 보여드리겠습니다.");

    await router.replace({ path: "/" });
  } catch (error) {
    console.error("Error submitting improvement request:", error);
  }
};
</script>