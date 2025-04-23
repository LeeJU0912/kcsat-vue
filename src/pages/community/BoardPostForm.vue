<template>
  <div>
    <div class="container font-nanum-gothic-regular">
      <!-- 문제 업로드 버튼 -->
      <button type="button" class="btn btn-dark m-2" @click="getMyBook">문제 업로드</button>

      <!-- 문제 선택 여부에 따른 조건부 렌더링 -->
      <div class="font-roman" v-if="questionData">
        <p class="font-nanum-gothic-bold">문제 유형 : {{ questionTypes.get(questionData.questionType) }}</p>
        <p>{{ questionData.title }}</p>
        <p>{{ questionData.mainText }}</p>
        <div v-for="choice in questionData.choices" :key="choice">
          <span>{{ choice }}</span>
          <br>
        </div>
        <br>
        <p>문제 공유 수 : {{ questionData.shareCounter }}</p>
      </div>

      <!-- 게시글 작성 폼 -->
      <form @submit.prevent="newPost">
        <div class="form-group">
          <label class="form-label mt-4 font-nanum-gothic-bold">글 제목</label>

          <div class="form-floating">
            <input type="text" v-model.trim="title" class="form-control" id="title" required />
          </div>

          <label class="form-label mt-4 font-nanum-gothic-bold">본문</label>
          <div class="form-floating">
            <textarea v-model="content" class="form-control" id="content" rows="10" style="height: 500px" required></textarea>
          </div>
        </div>

        <button type="submit" class="btn btn-primary">등록</button>
      </form>
    </div>

    <br>
  </div>
</template>

<script>
import {ref} from "vue";
import {useQuestionSelectStorage} from "@/piniaStorage/questionSelectStorage.js";
import api from "@/api.js";
import {usePostStorage} from "@/piniaStorage/postStorage.js";
import router from "@/router/index.js";
import {useBookStorage} from "@/piniaStorage/bookStorage.js";

export default {
  setup() {
    const questionSelectStorage = useQuestionSelectStorage();
    const postStorage = usePostStorage();
    const bookStorage = useBookStorage();
    const questionData = questionSelectStorage.getQuestionSelectData;
    questionSelectStorage.clearQuestionSelectData();

    const qId = questionData === null ? null : questionData.qid;
    const title = ref("");
    const content = ref("");


    const newPost = async () => {

      const data = {
        title: title.value,
        content: content.value,
        qid: qId === null ? null : qId,
      }

      console.log(data)

      try {
        const response = await api.post("/community/board/post", data);

        postStorage.setPostData(response.data);


        // 요청 성공 시 페이지 이동
        await router.replace({
          path: `/board/post/${response.data.post.pid}`,
        })
      } catch (error) {
        console.log(error);
      }
    }

    const getMyBook = async () => {
      try {
        const response = await api.get('/community/myBook');

        if (!response.data || !response.data.question || response.data.question.length === 0) {
          alert("저장된 문제가 없습니다.");
          return;
        }

        bookStorage.setBookData(response.data);

        // 요청 성공 시 페이지 이동
        await router.replace({
          path: "/board/post/question",
        })
      } catch (error) {
        console.log(error);
      }
    }

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
      questionData,
      title,
      content,
      newPost,
      getMyBook,
      questionTypes
    }
  }
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>
