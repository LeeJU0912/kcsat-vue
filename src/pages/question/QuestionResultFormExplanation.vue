<template>
  <div>
    <div class="container font-nanum-gothic-regular">

      <h6><span class="font-nanum-gothic-bold">{{ questionTypes.get(data?.questionType) }}</span> 해설 생성 완료</h6>
      <br>

      <div class="font-roman">
        <h4 class="font-nanum-gothic-bold">{{ data?.title }}</h4>

        <p>{{ data?.mainText }}</p>

        <div v-for="(choice, index) in data?.choices" :key="index">
          {{ choice }}
        </div>
      </div>

      <br>

      <!-- 정답 및 해설 표시 -->
      <div class="form-group">
        <p class="text-xl-left font-nanum-myeongjo-extrabold">정답 : {{ data.answer }}</p>
        <p class="text-md-left"><span class="font-nanum-myeongjo-extrabold">번역 : </span>{{ data.translation }}</p>
        <p class="text-md-left"><span class="font-nanum-myeongjo-extrabold">해설 : </span>{{ data.explanation }}</p>
      </div>

      <br>

      <div class="d-flex align-items-center mt-3">
        <!-- 저장 및 신고 버튼 -->
        <div v-if="saveComplete">
          <button class="btn btn-success" disabled>처리 완료!</button>
        </div>
        <div v-else>
          <button type="button" class="btn btn-primary mx-1" style="background-color: #002c62; border-color: #002c62" @click="postQuestion('/community/question')">내 문제집 저장</button>
          <button type="button" class="btn btn-danger" @click="postQuestion('/community/result/junk')">문제 신고하기</button>
        </div>

        <a href="/question" style="text-decoration: none">
          <button
              type="button"
              class="btn btn-secondary mx-1"
          >
            문제 다시 생성하기
          </button>
        </a>
      </div>

    </div> <!-- /container -->
  </div>
</template>

<script>
import {useQuestionStorage} from "@/piniaStorage/questionStorage.js";
import {ref} from "vue";
import api from "@/api.js";


export default {
  setup() {
    const questionStorage = useQuestionStorage();
    const saveComplete = ref(false);

    const data = questionStorage.getQuestionData;
    questionStorage.clearQuestionData();


    const questionTypes = new Map([
      ['PURPOSE', '글의 목적'],
      ['MAIN_IDEA', '글의 요지'],
      ['TITLE', '글의 제목 추론'],
      ['TOPIC', '글의 주제'],
      ['TARGET_UNMATCH', '대상 정보 불일치'],
      ['FEELING_CHANGE', '화자 심경 변화'],
      ['UNDERLINE', '밑줄 친 구문 의미'],
      ['BLANK', '빈칸 추론'],
      ['BLANK_AB', '빈칸 A,B 추론'],
      ['INFO_MATCH', '안내문 일치'],
      ['INFO_UNMATCH', '안내문 불일치'],
      ['GRAMMAR', '어법'],
      ['SUMMARIZE_AB', '요약문 A,B 추론'],
      ['ORDERING', '이어질 글의 순서 배열'],
      ['ARGUMENT', '필자가 주장하는 바'],
    ]);


    const postQuestion = async (url) => {
      try {
        const payload = {
          questionType: data.questionType,
          title: data.title,
          mainText: data.mainText,
          choices: data.choices,
          answer: data.answer,
          translation: data.translation,
          explanation: data.explanation,
        };

        console.log("Loading...")
        await api.post(url, payload);

        saveComplete.value = true;

      } catch (error) {
        console.log(error);
      }
    };

    return {
      data,
      saveComplete,
      questionTypes,
      postQuestion,
    };
  },
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>
