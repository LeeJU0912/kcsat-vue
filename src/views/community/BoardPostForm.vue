<template>
  <div class="container font-nanum-gothic-regular">
    <!-- 문제 업로드 버튼 -->
    <button type="button" class="btn btn-dark m-2" @click="getMyBook">문제 업로드</button>

    <!-- 문제 선택 여부에 따른 조건부 렌더링 -->
    <div v-if="questionData" class="font-roman">
      <p class="font-nanum-gothic-bold">문제 유형: {{ questionTypes.get(questionData.questionType) }}</p>
      <p>{{ questionData.title }}</p>
      <p>{{ questionData.mainText }}</p>
      <div v-for="choice in questionData.choices" :key="choice">
        <span>{{ choice }}</span>
        <br />
      </div>
      <br />
      <p>문제 공유 수: {{ questionData.shareCounter }}</p>
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

    <br />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuestionSelectStorage } from "@/store/questionSelectStorage";
import { usePostStorage } from "@/store/postStorage";
import { useBookStorage } from "@/store/bookStorage";
import { questionTypes } from "@/assets/constants/questionTypes";
import { createPost } from "@/services/postService";
import { fetchMyBook } from "@/services/myBookService.js";

const router = useRouter();
const questionSelectStorage = useQuestionSelectStorage();
const postStorage = usePostStorage();
const bookStorage = useBookStorage();

const questionData = questionSelectStorage.getQuestionSelectData;
questionSelectStorage.clearQuestionSelectData();

const qId = questionData ? questionData.qid : null;
const title = ref("");
const content = ref("");

const newPost = async () => {
  try {
    const payload = {
      title: title.value,
      content: content.value,
      qid: qId,
    };

    const response = await createPost(payload);

    postStorage.setPostData(response);
    await router.replace({ path: `/board/post/${response.post.pid}` });
  } catch (error) {
    console.error("게시글 작성 실패:", error);
    alert("게시글 작성에 실패했습니다. 다시 시도해 주세요.");
  }
};

const getMyBook = async () => {
  try {
    const bookData = await fetchMyBook();

    if (!bookData || !bookData.question || bookData.question.length === 0) {
      alert("저장된 문제가 없습니다.");
      return;
    }

    bookStorage.setBookData(bookData);
    await router.replace({ path: "/board/post/question" });
  } catch (error) {
    console.error("마이북 문제 로드 실패:", error);
    alert("마이북 문제 로딩에 실패했습니다. 다시 시도해 주세요.");
  }
};
</script>