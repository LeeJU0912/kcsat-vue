<template>
  <div class="container">
    <!-- 문제 본문 표시 -->
    <Question :question="question" />

    <br />

    <!-- 버튼 영역 -->
    <div class="container">
      <AnswerControl :showAnswer="showAnswer" @toggleAnswer="toggleAnswer" />

      <br />

      <QuestionSaveButton :saved="savedQuestion" @save="saveQuestion" />

      <router-link to="/weekly" class="btn btn-secondary btn-sm mx-1">
        목록으로 돌아가기
      </router-link>
    </div>

    <br />

    <!-- 정답/해설 표시 -->
    <Explanation v-if="showAnswer" :question="question" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuestionStorage } from "@/store/questionStorage";
import { saveWeeklyQuestion } from "@/services/questionService";

import Question from "@/components/question/Question.vue";
import AnswerControl from "@/components/question/AnswerControl.vue";
import QuestionSaveButton from "@/components/question/QuestionSaveButton.vue";
import Explanation from "@/components/question/Explanation.vue";

// 상태 변수
const showAnswer = ref(false);
const savedQuestion = ref(false);

// 문제 데이터 가져오기
const questionStorage = useQuestionStorage();
const question = questionStorage.getQuestionData;

// 컴포넌트 mount될 때 스토어 정리
onMounted(() => {
  questionStorage.clearQuestionData();
});

// 정답 보기 토글
const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value;
};

// 문제 저장하기
const saveQuestion = async () => {
  try {
    await saveWeeklyQuestion(question.qId);
    savedQuestion.value = true;
  } catch (error) {
    console.error('Error saving question:', error);
  }
};
</script>