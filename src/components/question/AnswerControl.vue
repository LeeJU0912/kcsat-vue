<template>
  <div class="container">
    <button class="btn btn-info btn-sm mx-1" @click="toggleAnswer">
      {{ showAnswer ? '정답 감추기' : '정답 확인하기' }}
    </button>
    <router-link class="btn btn-secondary btn-sm" to="/myBook">
      목록으로 돌아가기
    </router-link>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  showAnswer: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["toggleAnswer"]);

const toggleAnswer = () => {
  emit("toggleAnswer");
};
</script>