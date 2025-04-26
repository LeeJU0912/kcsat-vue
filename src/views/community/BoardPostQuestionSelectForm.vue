<template>
  <div class="container font-nanum-gothic-regular">
    <h3>첨부할 문제를 골라 주세요!</h3>
    <QuestionTable :questions="book?.question" @clickRow="openQuestionDetails" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import { useBookStorage } from "@/store/bookStorage";
import { useQuestionSelectStorage } from "@/store/questionSelectStorage";
import { fetchQuestionDetail } from "@/services/questionService.js";
import QuestionTable from "@/components/question/QuestionTable.vue";

// 스토어 가져오기
const bookStorage = useBookStorage();
const questionSelectStorage = useQuestionSelectStorage();

// 데이터 초기화
const book = ref(bookStorage.getBookData);

// 문제 선택 핸들러
const openQuestionDetails = async (qid) => {
  try {
    const response = await fetchQuestionDetail(qid);

    questionSelectStorage.setQuestionSelectData({
      qid: response.data.qid,
      questionType: response.data.questionType,
      title: response.data.title,
      mainText: response.data.mainText,
      choices: response.data.choices,
      answer: response.data.answer,
      translation: response.data.translation,
      explanation: response.data.explanation,
      shareCounter: response.data.shareCounter,
    });

    await router.replace({ path: "/board/post" });
  } catch (error) {
    console.error("Error fetching question detail:", error);
  }
};
</script>