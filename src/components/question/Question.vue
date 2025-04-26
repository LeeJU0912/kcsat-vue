<template>
  <div class="form-group font-roman">
    <h3 class="text-xl-left font-nanum-gothic-bold">{{ question.title }}</h3>
    <p class="text-xl-left">{{ question.mainText }}</p>

    <div v-for="(choice, index) in question.choices" :key="index">
      <b class="text-xl-left">{{ choice }}</b>
    </div>
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