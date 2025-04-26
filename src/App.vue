<template>

  <div class="min-vh-85 bg-light" style="border-bottom: 1px solid #ddd;">

    <div style="border-bottom: 1px solid #ddd;">
      <div class="container-fluid">
        <Header/>
      </div>
    </div>

    <div class="container-fluid">
      <br>
      <div class="container custom-container" style="max-width: 1100px">
        <transition name="fade" mode="out-in">
          <router-view/>
        </transition>
      </div>
      <br>
      <br>
    </div>

    <div class="container-fluid">
      <Footer/>
    </div>
  </div>

</template>

<script setup>
import Header from "@/layouts/Header.vue";
import Footer from "@/layouts/Footer.vue";

import { onMounted } from 'vue';
import { fetchCommonData } from '@/services/commonService';

// 앱 최초 진입 시 공통 데이터 불러오기
onMounted(async () => {
  try {
    const result = await fetchCommonData();
    console.log('공통 데이터 불러오기 성공:', result);
  } catch (error) {
    console.error('공통 데이터 불러오기 실패:', error);
  }
});
</script>

<style scoped>
.min-vh-85 {
  min-height: 85vh; /* 화면 높이의 85% */
}
.custom-container {
  border: 2px solid #ddd; /* 테두리 색상 */
  border-radius: 10px; /* 곡선 정도 */
  padding: 50px; /* 내부 여백 */
  background-color: #f2f2f2; /* 배경 색상 */
  /*box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}
.container-fluid {
  max-width: 1150px;
}

/* fade 애니메이션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>