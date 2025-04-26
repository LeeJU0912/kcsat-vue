<template>
  <div>
    <div class="container">
      <!-- 회원 목록 반복 출력 -->
      <div v-for="member in members" :key="member.mid">
        <p>{{member.mid}}</p>
        <div>ID: {{ member.mid }}</div>
        <div>Email: {{ member.email }}</div>
        <div>
          <!-- 회원 이름과 링크 -->
          <router-link :to="`/admin/members/${member.mid}`">{{member.username}}</router-link>
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
    const members = ref();

    const getMemberData = async () => {
      try {
        const response = await api.get("/community/admin/members");
        members.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(() => {
      getMemberData();
    })

    return {
      members,
    }
  }
};
</script>

<style scoped>
/* 스타일 정의 가능 */
</style>
