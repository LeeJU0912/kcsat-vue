<template>
  <div class="container font-nanum-gothic-regular">
    <!-- 데이터가 있을 때만 출력 -->
    <div v-if="data">
      <h6><span class="font-nanum-gothic-bold">{{ questionTypes.get(data?.questionType) }}</span> 문제 생성 완료</h6>
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


      <div v-if="data.questionType === 'TARGET_UNMATCH'
        || data.questionType === 'BLANK_AB'
        || data.questionType === 'INFO_MATCH'
        || data.questionType === 'INFO_UNMATCH'
        || data.questionType === 'GRAMMAR'
        || data.questionType === 'SUMMARIZE_AB'">
        <p><span class="font-nanum-gothic-bold" style="color: red">해설 생성이 지원되지 않는 유형입니다.</span></p>
      </div>
      <div v-else>
        <!-- 버튼 클릭 시 POST 요청 -->
        <button @click="fetchExplanation" class="submitButton btn btn-primary" :disabled="loading" style="background-color: #002c62; border-color: #002c62">
        <span v-if="loading">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
        </span>
          <span v-else>해설 생성</span>
        </button>
      </div>


      <div v-if="error">
        <span class="font-nanum-gothic-extrabold" style="color: red">해설 생성을 실패하였습니다.</span>
      </div>
      <div v-else>
        <div v-if="loading">
          <div v-if="nowOffset > 0">
            <span>현재 앞에 <span class="font-nanum-gothic-bold">{{nowOffset}}</span>명 대기중입니다.</span>
          </div>
          <div v-else-if="nowOffset === 0">
            <span class="font-nanum-gothic-extrabold" style="color: green">해설 생성중입니다!!!!!</span>
          </div>
          <div v-else>
            <span>해설 생성 로딩중......</span>
          </div>
        </div>
        <div v-else>
          <br>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No data available</p>
    </div>
  </div>
</template>

<script>
import {onUnmounted, ref} from "vue";
import api from "@/services/api.js";
import router from "@/router/index.js";

import {useQuestionStorage} from "@/store/questionStorage.js";
import {questionTypes} from "@/assets/constants/questionTypes.js";


export default {
  setup() {
    const error = ref(false);
    const loading = ref(false);
    const nowOffset = ref(null); // nowOffset 값 저장
    let intervalId = null; // setInterval ID 관리
    let intervalId2 = null;

    const firstContact = async () => {
      try {
        console.log("First contact")

        await api.get('/question/firstExplanationContact');

      } catch (error) {
        console.log(error);
      }
    }

    const startNowOffsetLoop = () => {
      // 1초마다 nowOffset 값을 갱신하는 루프 시작
      intervalId = setInterval(async () => {
        try {
          const response = await api.get("/question/explanationNowOffset");
          nowOffset.value = response.data; // API 응답 데이터를 nowOffset에 저장
          console.log("Now Offset:", nowOffset.value);

          if (nowOffset.value === 0) {
            // 200초 후에 루프를 멈추기 위한 타이머 설정
            setTimeout(() => {
              stopNowOffsetLoop();
              stopGetExplanationLoop();
            }, 120000); // 120초
          }
        } catch (error) {
          console.error("NowOffset 가져오기 실패:", error);
        }
      }, 3000);
    };

    const stopNowOffsetLoop = () => {
      // 루프 정지
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        error.value = true;
      }
    };


    const questionStorage = useQuestionStorage();
    const data = questionStorage.getQuestionData;
    questionStorage.clearQuestionData();


    const startGetExplanationLoop = () => {
      return new Promise((resolve, reject) => {

        intervalId2 = setInterval(async () => {
          try {
            const response = await api.get("/explanation", data);

            if (response.status === 204) {
              console.log("Waiting for Explanation...");
            } else {
              // Pinia 스토어에 데이터 저장
              questionStorage.setQuestionData({
                questionType: response.data.questionType,
                title: response.data.title,
                mainText: response.data.mainText,
                choices: response.data.choices,
                answer: response.data.answer,
                translation: response.data.translation,
                explanation: response.data.explanation,
              });

              stopGetExplanationLoop();
              stopNowOffsetLoop();
              resolve(response);
            }
          } catch (error) {
            console.error("Error fetching question:", error);
            reject(error);
          }
        }, 2000);
      })

    };

    const stopGetExplanationLoop = () => {
      // 루프 정지
      if (intervalId2) {
        clearInterval(intervalId2);
        intervalId2 = null;
      }
    };

    const fetchExplanation = async () => {
      try {
        loading.value = true;
        error.value = false;

        console.log("Loading...")

        await firstContact();
        startNowOffsetLoop();
        await api.post('/explanation', data);
        await startGetExplanationLoop();


        // 요청 성공 시 페이지 이동
        await router.replace({
          path: '/explanation/result',
        })
      } catch (error) {
        console.log(error);
        stopNowOffsetLoop();
      }
    };


    // 컴포넌트가 언마운트될 때 루프 정리
    onUnmounted(() => {
      stopNowOffsetLoop();
    });

    return {
      data,
      loading,
      fetchExplanation,
      nowOffset,
      questionTypes,
      error,
    };
  },
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>
