<template>
  <div class="container font-nanum-gothic-regular">
    <form @submit.prevent="signIn">
      <div class="form-group">
        <label class="form-label mt-4 font-nanum-gothic-bold">로그인</label>

        <!-- 이메일 + 비밀번호 입력 컴포넌트 -->
        <EmailPasswordForm v-model:email="email" v-model:password="password" :loginError="loginError" />

      </div>

      <!-- 로그인 및 회원 가입 버튼 -->
      <div class="d-flex justify-content-start">
        <button type="submit" class="btn btn-primary">
          Log in
        </button>
        <router-link to="/signup" class="btn btn-outline-primary mx-2">
          회원 가입
        </router-link>
      </div>
    </form>
    <br />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import EmailPasswordForm from "@/components/auth/EmailPasswordForm.vue";

const email = ref("");
const password = ref("");
const loginError = ref(false);
const router = useRouter();

const signIn = async () => {
  if (!email.value || !password.value) {
    loginError.value = true;
    return;
  }

  try {
    const payload = {
      userEmail: email.value,
      password: password.value,
    };

    const response = await api.post("/community/open/signIn", payload);
    const token = response.data;

    sessionStorage.setItem('jwt', token);

    // 페이지를 완전히 새로고침하여 헤더/푸터 포함 모든 것을 리셋
    window.location.href = '/';
  } catch (err) {
    console.error('Login failed:', err);
    loginError.value = true;
  }
};
</script>