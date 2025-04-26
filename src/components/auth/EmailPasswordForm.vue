<template>
  <div class="form-group">
    <label class="form-label mt-4 font-nanum-gothic-bold">로그인</label>

    <!-- 이메일 입력 -->
    <div class="form-floating mb-3" :class="{ 'has-danger': loginError }">
      <input
          type="email"
          v-model="emailModel"
          class="form-control"
          :class="{ 'is-invalid': loginError }"
          id="floatingInput"
          placeholder="name@example.com"
      />
      <label for="floatingInput">이메일 주소</label>
      <div v-if="loginError" class="invalid-feedback">
        이메일 혹은 비밀번호가 잘못되었습니다.
      </div>
    </div>

    <!-- 비밀번호 입력 -->
    <div class="form-floating mb-4">
      <input
          type="password"
          v-model="passwordModel"
          class="form-control"
          id="floatingPassword"
          placeholder="Password"
      />
      <label for="floatingPassword">비밀번호</label>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineModel } from 'vue';

// 부모에서 v-model로 넘겨받기
const emailModel = defineModel('email');
const passwordModel = defineModel('password');

const props = defineProps({
  loginError: {
    type: Boolean,
    default: false,
  },
});
</script>