<template>
  <div class="container">
    <!-- 데이터가 있을 때만 출력 -->
    <div v-if="data">
      <h6 class="font-nanum-gothic-regular"><span class="font-nanum-gothic-bold">{{ questionTypes.get(data?.questionType) }}</span> 문제 생성 완료</h6>
      <br>

      <div class="font-roman">
        <h4 class="font-nanum-gothic-bold">{{ data?.title }}</h4>

        <p>{{ data?.mainText }}</p>

        <div v-for="(choice, index) in data?.choices" :key="index">
          {{ choice }}
        </div>

<!--        <br>-->
<!--        <div class="font-nanum-myeongjo-extrabold">정답: {{ data?.answer }}</div>-->
      </div>
      <br>
      <p><span class="font-nanum-gothic-bold" style="color: red">로그인 하시면 외부 영어 지문으로 '수능 영어 문제 생성', '번역 및 해설 생성' 기능을 이용하실 수 있습니다.</span></p>
    </div>
    <div v-else>
      <p>No data available</p>
    </div>
  </div>
</template>

<script>
import {useQuestionStorage} from "@/store/questionStorage.js";

export default {
  setup() {
    const questionStorage = useQuestionStorage();
    const data = questionStorage.getQuestionData;

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

    return {
      data,
      questionTypes,
    };
  },
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>
