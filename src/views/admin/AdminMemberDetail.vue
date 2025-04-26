<template>
  <div>
    <div class="container">
      <div v-if="member">
        <!-- 회원 정보 표시 -->
        <div>회원가입 시기 : {{ member.createdDate }}</div>
        <div>MemberID : {{ member.mid }}</div>
        <div>Email : {{ member.email }}</div>
        <div>닉네임 : {{ member.username }}</div>

        <!-- 작성글 보기 링크 -->
        <div>
          <router-link :to="`/admin/members/${member.mid}/posts`">작성글 보기</router-link>
        </div>

        <!-- 작성 댓글 보기 링크 -->
        <div>
          <router-link :to="`/admin/members/${member.mid}/comments`">작성 댓글 보기</router-link>
        </div>

        <!-- 회원 목록 버튼 -->
        <a href="/admin/members" class="btn btn-outline-secondary">회원 목록</a>

        <br />
      </div>

    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import api from "@/services/api.js";
import {useRouter} from "vue-router";

export default {
  setup() {
    const route = useRouter();

    const member = ref();

    const getUserDetails = async () => {
      try {
        const response = await api.get(`/community/admin/members/1`);

        member.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(() => {
      getUserDetails();
    })

    return {
      member
    }
  }
};
</script>