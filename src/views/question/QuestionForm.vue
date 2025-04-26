<template>
  <div>
    <div class="container font-nanum-gothic-regular">
      <!-- 문제 유형 선택 -->
      <div class="form-group">
        <label for="type" class="font-nanum-gothic-bold">문제 유형 선택</label>
        <select v-model="selectedType" id="type" class="form-control">
          <option v-for="questionType in questionTypes" :key="questionType.key" :value="questionType.key">
            {{ questionType.value }}
          </option>
        </select>
      </div>

      <br>

      <!-- 지문 입력 -->
      <div class="form-group">
        <label for="mainText" class="font-nanum-gothic-bold">지문 입력</label>
        <textarea
            v-model="mainText"
            class="form-control"
            id="mainText"
            placeholder="생성하고자 하는 영어 지문을 입력하세요. (지문을 입력하지 않는 경우, 무작위 기출 지문으로 문제가 만들어집니다.)"
            rows="8"
            minlength="500"
            maxlength="2000"
        ></textarea>
      </div>

      <div class="container mt-1">
        <!-- AI 문제 생성 버튼 -->
        <button
            type="button"
            class="btn btn-primary mx-1"
            :disabled="loading"
            @click="validate_mainText_length"
            style="background-color: #002c62; border-color: #002c62"
        >
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </span>
          <span v-else>AI 문제 생성</span>
        </button>
      </div>
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
  </div>
</template>

<script>
import {useRouter} from "vue-router";
import {onUnmounted, ref} from "vue";
import api from "@/services/api.js"

import { useQuestionStorage } from '@/store/questionStorage';


export default {
  setup() {
    const router = useRouter();
    const error = ref(false);
    const loading = ref(false);
    const questionStorage = useQuestionStorage();

    const selectedType = ref("PURPOSE");
    const mainText = ref("");

    const nowType = ref("");
    const nowOffset = ref(null); // nowOffset 값 저장
    let intervalId = null; // setInterval ID 관리
    let intervalId2 = null;



    const questionTypes = [
      { key: "PURPOSE", value: "글의 목적" },
      { key: "MAIN_IDEA", value: "글의 요지" },
      { key: "TITLE", value: "글의 제목 추론" },
      { key: "TOPIC", value: "글의 주제" },
      { key: "TARGET_UNMATCH", value: "대상 정보 불일치" },
      { key: "FEELING_CHANGE", value: "화자 심경 변화" },
      { key: "UNDERLINE", value: "밑줄 친 구문 의미" },
      { key: "BLANK", value: "빈칸 추론" },
      { key: "BLANK_AB", value: "빈칸 A,B 추론" },
      { key: "INFO_MATCH", value: "안내문 일치" },
      { key: "INFO_UNMATCH", value: "안내문 불일치" },
      { key: "GRAMMAR", value: "어법" },
      { key: "SUMMARIZE_AB", value: "요약문 A,B 추론" },
      { key: "ORDERING", value: "이어질 글의 순서 배열" },
      { key: "ARGUMENT", value: "필자가 주장하는 바" }
    ];


    const firstContact = async () => {
      try {
        console.log("First contact")

        await api.get('/question/firstQuestionContact');

      } catch (error) {
        console.log(error);
      }
    }


    const startNowOffsetLoop = () => {
      // 1초마다 nowOffset 값을 갱신하는 루프 시작
      intervalId = setInterval(async () => {
        try {
          const response = await api.get("/question/questionNowOffset");
          nowOffset.value = response.data; // API 응답 데이터를 nowOffset에 저장
          console.log("Now Offset:", nowOffset.value);

          if (nowOffset.value === 0) {
            // 180초 후에 루프를 멈추기 위한 타이머 설정
            setTimeout(() => {
              stopNowOffsetLoop();
              stopGetQuestionLoop();
            }, 60000); // 60초 = 60,000 밀리초
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

    const startGetQuestionLoop = () => {
      return new Promise((resolve, reject) => {

        intervalId2 = setInterval(async () => {
          try {
            const response = await api.get("/question", nowType.value);

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

    const fetchQuestion = async (url) => {
      try {
        loading.value = true;
        error.value = false;

        const payload = {
          type: selectedType.value,
          mainText: mainText.value,
        };

        console.log("Loading...")

        await firstContact();
        startNowOffsetLoop();

        const response = await api.post(url, payload);
        nowType.value = response.data;
        await startGetQuestionLoop();


        // 요청 성공 시 페이지 이동
        await router.replace({path: '/question/result'});
      } catch (error) {
        console.log(error);
        stopNowOffsetLoop();
      }
    };

    const validate_mainText_length = () => {
      if (mainText.value.length > 0 && mainText.value.length < 500) {
        alert('글자 수가 너무 적습니다. 500자 이상 입력해주세요.');
      } else if (mainText.value.length > 2000) {
        alert('글자 수가 너무 많습니다. 2000자 이하로 입력해주세요.');
      } else {
        // 글자 수가 유효한 경우 fetchQuestion 호출
        const endpoint = mainText.value.length === 0
            ? '/question/random'
            : '/question';
        fetchQuestion(endpoint);
      }
    }


    // 컴포넌트가 언마운트될 때 루프 정리
    onUnmounted(() => {
      stopNowOffsetLoop();
    });

    return {
      selectedType,
      mainText,
      questionTypes,
      validate_mainText_length,
      loading,
      nowOffset,
      error,
    };
  }
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>
