<template>
  <div class="container font-nanum-gothic-regular">
    <form @submit.prevent="submitForm">
      <!-- 이메일 입력 -->
      <div class="form-group">
        <label for="email" class="form-label mt-4 font-nanum-gothic-bold">이메일</label>
        <input
            type="email"
            v-model="email"
            class="form-control"
            id="email"
            placeholder="이메일을 입력하세요."
        />

        <!-- 닉네임 입력 -->
        <label for="username" class="form-label mt-4 font-nanum-gothic-bold">닉네임</label>
        <input
            type="text"
            v-model="username"
            class="form-control"
            id="username"
            placeholder="닉네임을 입력하세요."
        />

        <!-- 비밀번호 입력 -->
        <label for="password" class="form-label mt-4 font-nanum-gothic-bold">비밀번호</label>
        <input
            type="password"
            v-model="password"
            class="form-control"
            id="password"
            placeholder="비밀번호를 입력하세요."
        />
      </div>

      <!-- 제출 버튼 -->
      <div class="d-flex justify-content-start mt-3">
        <button type="submit" class="btn btn-primary">
          회원 가입
        </button>
      </div>
    </form>
    <br />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const email = ref("");
const username = ref("");
const password = ref("");
const error = ref(false);

const router = useRouter();

const submitForm = async () => {
  try {
    const payload = {
      email: email.value,
      username: username.value,
      password: password.value,
    };

    await api.post("/community/open/signUp", payload);

    alert("회원가입 되었습니다 :)");

    await router.replace({ path: "/signIn" });
  } catch (err) {
    console.error("Error during signup:", err);
    error.value = true;
  }
};
</script>