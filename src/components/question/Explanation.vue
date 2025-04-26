<template>
  <div class="form-group">
    <p class="text-xl-left font-nanum-myeongjo-extrabold">
      정답 : {{ question.answer }}
    </p>
    <p class="text-xl-left">
      <span class="font-nanum-myeongjo-extrabold">번역 : </span>{{ question.translation }}
    </p>
    <p class="text-xl-left">
      <span class="font-nanum-myeongjo-extrabold">해설 : </span>{{ question.explanation }}
    </p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
});
</script>