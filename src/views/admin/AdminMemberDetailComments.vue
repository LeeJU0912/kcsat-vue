<template>
  <div>
    <div class="container">
      <!-- 사용자 이름과 댓글 제목 표시 -->
      <div>{{ username }}의 작성 댓글입니다.</div>

      <!-- 댓글 리스트 반복 출력 -->
      <div v-for="comment in comments" :key="comment.cId">
        <div>CommentID : {{ comment.cId }}</div>
        <div>작성일 : {{ comment.createdDateTime }}</div>
        <div>내용 : {{ comment.content }}</div>
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
    const comments = memberData.comments;
    const mId = memberData.mId;

    return {
      comments,
      username,
      mId,
    }
  }
};
</script>

<style scoped>
/* 스타일 정의 */
</style>
