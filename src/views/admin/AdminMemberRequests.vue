<template>
  <div>
    <div class="container">
      <!-- 사용자 건의 사항 리스트 반복 출력 -->
      <div v-for="userRequest in userRequests" :key="userRequest.id">
        <div>건의 유형 : {{ userRequest.type }}</div>
        <div>건의 글 : {{ userRequest.content }}</div>
        <div>Email : {{ userRequest.member.email }}</div>

        <!-- 질문이 있을 경우 -->
        <div v-if="userRequest.question">
          <div>QId : {{ userRequest.question.id }}</div>
          <div>질문 : {{ userRequest.question.title }}</div>
          <div>본문 : {{ userRequest.question.mainText }}</div>

          <!-- 질문의 선택지 반복 출력 -->
          <div v-for="choice in userRequest.question.choices" :key="choice.id">
            <div>{{ choice.choice }}</div>
          </div>
        </div>
      </div>

      <!-- 관리자 화면으로 이동 -->
      <router-link to="/admin" class="btn btn-outline-secondary">관리자 화면</router-link>

      <br />
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import api from "@/services/api.js";

export default {
  setup() {
    const userRequests = ref([]);

    const getUserRequests = async () => {
      try {
        const response = await api.get("/community/admin/requests");

        userRequests.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(() => {
      getUserRequests();
    })

    return {
      userRequests,
    }
  }
};
</script>

<style scoped>
/* 스타일 정의 가능 */
</style>
