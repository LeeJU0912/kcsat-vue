<template>
  <div class="container font-nanum-gothic-regular">
    <QuestionTable :questions="book?.question" @clickRow="openQuestionDetails" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useBookStorage } from "@/store/bookStorage";
import { useQuestionStorage } from "@/store/questionStorage";
import { fetchMyBook } from "@/services/myBookService.js";
import { fetchQuestionDetail } from "@/services/questionService.js";
import router from "@/router";
import QuestionTable from "@/components/question/QuestionTable.vue";

const book = ref(null);
const bookStorage = useBookStorage();
const questionStorage = useQuestionStorage();

const loadMyBook = async () => {
  try {
    const response = await fetchMyBook();
    book.value = response;
    bookStorage.setBookData(response);
  } catch (error) {
    console.error('Error loading myBook:', error);
  }
};

const openQuestionDetails = async (qid) => {
  try {
    const response = await fetchQuestionDetail(qid);
    questionStorage.setQuestionData({
      qid: response.data.qid,
      questionType: response.data.questionType,
      title: response.data.title,
      mainText: response.data.mainText,
      choices: response.data.choices,
      answer: response.data.answer,
      translation: response.data.translation,
      explanation: response.data.explanation,
    });
    await router.replace({ path: `/myBook/${qid}` });
  } catch (error) {
    console.error('Error loading question detail:', error);
  }
};

onMounted(async () => {
  const cachedBook = bookStorage.getBookData;
  if (cachedBook) {
    book.value = cachedBook;
  } else {
    await loadMyBook();
  }
});
</script>