<template>
  <div class="container text-center font-nanum-gothic-regular">
    <div class="jumbotron">
      <br>
      <div>
        <h1 class="nav-item font-nanum-gothic-extrabold">ETA</h1>
      </div>

      <div class="font-nanum-gothic-regular">
        <h4 class="nav-item font-nanum-gothic-bold">무료 AI 영어 문제 생성</h4>
        <br>
        <p><span class="font-nanum-gothic-extrabold">ETA(English Test Agent)</span>는 대학수학능력시험 영어 영역 스타일의 문제를 AI를 이용하여 자동으로 생성하고,</p>
        <p>문제에 해당되는 번역과 실질적인 솔루션을 제공해 주는 서비스입니다.</p>
        <p><span class="font-nanum-gothic-extrabold">총 15개 유형</span>의 문제를 제작할 수 있고 문제를 사용자들과 공유함으로써</p>
        <p>영어 실력을 키워나갈 수 있는 커뮤니티입니다.</p>
        <br>
      </div>

      <div class="font-nanum-gothic-extrabold">
        <p>아래 버튼을 눌러 무료로 AI 문제 생성을 해보세요!!</p>
        <p>You can make your own English-Korean AI Questions for FREE!!</p>
      </div>

      <br>

      <button type="button" class="submitButton btn btn-primary btn-lg" style="background-color: #002c62; border-color: #002c62" @click="fetchQuestion" :disabled="loading">
        <span class="font-nanum-gothic">
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
            Loading...
          </span>
          <span v-else>
            AI 영어 문제 생성
          </span>
        </span>
      </button>

      <div>
        <div v-if="error">
          <span class="font-nanum-gothic-extrabold" style="color: red">문제 생성을 실패하였습니다.</span>
        </div>
        <div v-else>
          <div v-if="loading">
            <div v-if="nowOffset > 0">
              <span>현재 앞에 <span class="font-nanum-gothic-bold">{{nowOffset}}</span>명 대기중입니다.</span>
            </div>

            <div v-else-if="nowOffset === 0">
              <span class="font-nanum-gothic-extrabold" style="color: green">문제 생성중입니다!</span>
            </div>

            <div v-else>
              <span>문제 생성 로딩중......</span>
            </div>
          </div>

          <div v-else>
            <br>
          </div>
        </div>
      </div>
      <br>
    </div>
  </div>
</template>

<script>
import api from "@/services/api.js"
import {computed, onUnmounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import {useQuestionStorage} from "@/store/questionStorage.js";

export default {
  setup() {
    const isAuthenticated = computed(() => !!sessionStorage.getItem("jwt"));
    const router = useRouter();
    const loading = ref(false);
    const error = ref(false);
    const questionStorage = useQuestionStorage();

    const nowType = ref("");
    const nowOffset = ref(null); // nowOffset 값 저장
    let intervalId = null; // setInterval ID 관리
    let intervalId2 = null;


    // 문제 생성 로직
    const fetchQuestion = async () => {
      try {
        loading.value = true;
        error.value = false;

        console.log("Loading...")

        await firstContact();
        startNowOffsetLoop();

        const response = await api.post('/question/allRandom');
        nowType.value = response.data;
        await startGetQuestionLoop();

        await getQuestion();

        if (isAuthenticated.value) {
          await router.replace({
            path: '/question/result'
          });
        } else {
          await router.replace({
            path: '/question/demo/result'
          });
        }
      } catch (error) {
        console.log(error);
        stopNowOffsetLoop();
      }
    };

    // 문제 생성 Kafka Topic 생성
    const firstContact = async () => {
      try {
        console.log("First contact")

        await api.get('/question/firstQuestionContact')

      } catch (error) {
        error.value = true;
        console.log(error);
      }
    }

    // 문제 생성 요청
    const startGetQuestionLoop = () => {
      return new Promise((resolve, reject) => {

        intervalId2 = setInterval(async () => {
          try {
            const response = await api.post("/question", nowType.value);

            if (response.status === 204) {
              console.log("Waiting for Question...");
            } else {
              // Pinia 스토어에 데이터 저장
              questionStorage.setQuestionData({
                questionType: response.data.questionType,
                title: response.data.title,
                mainText: response.data.mainText,
                choices: response.data.choices,
                answer: response.data.answer,
              });

              stopGetQuestionLoop();
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

    const stopGetQuestionLoop = () => {
      // 루프 정지
      if (intervalId2) {
        clearInterval(intervalId2);
        intervalId2 = null;
      }
    };

    // 문제
    const startNowOffsetLoop = () => {
      // 1초마다 nowOffset 값을 갱신하는 루프 시작
      intervalId = setInterval(async () => {
        try {
          const response = await api.get("/question/questionNowOffset");
          nowOffset.value = response.data.data; // API 응답 데이터를 nowOffset에 저장
          console.log("Now Offset:", nowOffset.value);

          if (nowOffset.value === 0) {
            // 180초 후에 루프를 멈추기 위한 타이머 설정
            setTimeout(() => {
              stopNowOffsetLoop();
              stopGetQuestionLoop();
            }, 60000); // 60초 = 60,000 밀리초
          }
        } catch (error) {
          console.error("Now Offset 가져오기 실패:", error);
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

    // 문제 데이터 요청
    const getQuestion = async () => {
      try {
        const response = await api.get("/question", nowType.value);

        // Pinia 스토어에 데이터 저장
        questionStorage.setQuestionData({
          questionType: response.data.data.questionType,
          title: response.data.data.title,
          mainText: response.data.data.mainText,
          choices: response.data.data.choices,
          answer: response.data.data.answer,
        });
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    }

    // 컴포넌트가 언마운트될 때 루프 정리
    onUnmounted(() => {
      stopNowOffsetLoop();
    });

    return {
      fetchQuestion,
      loading,
      nowOffset,
      error,
    };
  }
}

</script>

<style>

</style>