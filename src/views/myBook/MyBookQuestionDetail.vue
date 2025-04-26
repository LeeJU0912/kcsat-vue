<template>
  <div class="container font-nanum-gothic-regular">
    <p class="text-xl-left">{{ questionTypes.get(question?.questionType) }}</p>

    <Question :question="question" />

    <br />

    <AnswerControl :showAnswer="showAnswer" @toggleAnswer="toggleAnswer" />

    <br />

    <Explanation v-if="showAnswer" :question="question" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuestionStorage } from "@/store/questionStorage";
import { questionTypes } from "@/assets/constants/questionTypes";
import Question from "@/components/question/Question.vue";
import Explanation from "@/components/question/Explanation.vue";
import AnswerControl from "@/components/question/AnswerControl.vue";

const showAnswer = ref(false);

const questionStorage = useQuestionStorage();
const question = questionStorage.getQuestionData;

// 페이지 진입 시 스토어 초기화 (선택사항, 상황에 따라)
questionStorage.clearQuestionData();

const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value;
};
</script>