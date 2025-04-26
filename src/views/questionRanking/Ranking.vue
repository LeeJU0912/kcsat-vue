<template>
  <div>
    <div class="container">
      <div v-if="questions.length > 0">
        <!-- 인기 문제 리스트 출력 -->
        <div v-for="(question, index) in questions" :key="question.qid">
          <div class="font-nanum-gothic-extrabold">{{ index + 1 }}위 인기 문제</div>
          <div class="font-roman-bold fake-link" @click="questionDetails(question.qid)">
            {{question.title}}
          </div>
          <div class="font-roman">{{ question.mainText }}</div>
          <div class="font-nanum-gothic-regular">문제 공유 카운트: {{ question.shareCounter }}</div>
        </div>
      </div>
      <div v-else>
        <div>인기 문제 집계 중</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { fetchRankedQuestions } from "@/services/rankedQuestionService.js";
import { fetchQuestionDetail } from "@/services/questionService.js";
import { useQuestionStorage } from '@/store/questionStorage';
import router from "@/router/index";

export default {
  setup() {
    const questions = ref([]);
    const isLoading = ref(false);
    const questionStorage = useQuestionStorage();

    const rankedQuestions = async () => {
      isLoading.value = true;
      try {
        questions.value = await fetchRankedQuestions();
      } catch (error) {
        console.error('Error fetching ranked questions:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const questionDetails = async (qId) => {
      try {
        const response = await fetchQuestionDetail(qId);

        questionStorage.setQuestionData({
          qId: response.data.qid,
          questionType: response.data.questionType,
          title: response.data.title,
          mainText: response.data.mainText,
          choices: response.data.choices,
          answer: response.data.answer,
          translation: response.data.translation,
          explanation: response.data.explanation,
        });

        await router.replace({ path: `/weekly/${qId}` });
      } catch (error) {
        console.error('Error fetching question details:', error);
      }
    };

    onMounted(() => {
      rankedQuestions();
    });

    return {
      questions,
      isLoading,
      questionDetails,
    };
  }
};
</script>

<style scoped>
.fake-link {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.fake-link:hover {
  color: darkblue;
}
</style>
