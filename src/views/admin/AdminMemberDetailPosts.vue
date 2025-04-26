<template>
  <div>
    <div class="container">
      <!-- 사용자 이름과 댓글 제목 표시 -->
      <div>{{ username }}의 작성 게시글입니다.</div>

      <!-- 게시글 리스트 반복 출력 -->
      <div v-for="post in posts" :key="post.PId">
        <div>PostID : {{ post.PId }}</div>
        <div>작성일 : {{ post.postDate }}</div>
        <div>제목 : {{ post.title }}</div>
        <div>본문 : {{ post.content }}</div>
        <div>첨부 문제 유형 : {{ post.questionType }}</div>
      </div>

      <!-- 회원 상세 정보로 이동 -->
      <router-link :to="`/admin/members/${mId}`" class="btn btn-outline-secondary">회원 상세 정보</router-link>

      <br />
    </div>
  </div>
</template>

<script>
import {useMemberStorage} from "@/store/memberStorage.js";

export default {
  setup() {
    const memberStorage = useMemberStorage();
    const memberData = memberStorage.getMemberData;
    const username = memberData.username;
    const posts = memberData.posts;
    const mId = memberData.mId;

    return {
      posts,
      username,
      mId,
    }
  }
};
</script>

<style scoped>
/* 스타일 정의 */
</style>
