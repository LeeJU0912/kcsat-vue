<template>
  <div class="bg-light sticky-top">
    <div class="navbar navbar-light">
      <!-- 로고 이미지와 제목 -->
      <a href="/" style="color:#002c62; text-decoration: none">
        <div class="d-flex justify-content-between align-items-center">
          <img class="rounded justify-content-sm-start" src="/src/assets/logo.png" style="height: 50px" alt="logo" />
          <!--      <span class="h1 lead" style="margin-left: 13px">English Test Agent</span>-->
          <!-- 두 줄을 공백 없이 붙이기 -->
          <div class="container">
            <!-- 첫 번째 줄 -->
            <div class="row g-0"> <!-- g-0은 row 간의 gutter를 제거 -->
              <div class="col p-0 m-0"> <!-- padding(p-0)과 margin(m-0)을 제거 -->
                <p class="m-0 font-nanum-gothic-extrabold" style="font-size: x-large; margin-bottom: 0; line-height: 1.1;">ETA</p> <!-- mb-0은 p 태그의 기본 margin-bottom을 제거 -->
              </div>
            </div>

            <!-- 두 번째 줄 -->
            <div class="row g-0">
              <div class="col p-0 m-0">
                <p class="m-0 fw-light font-nanum-gothic-bold" style="font-size: small; margin-bottom: 0; line-height: 1.3;">English Test Agent</p>
              </div>
            </div>
          </div>
        </div>
      </a>


      <div class="navbar-expand font-nanum-gothic-bold" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li v-if="role === 'ROLE_ADMIN'" class="nav-item font-nanum-gothic-extrabold">
            <a class="nav-link" href="/admin" style="color: purple">Admin 관리</a>
          </li>
          <li class="nav-item font-nanum-gothic-extrabold">
            <a class="nav-link text-danger" href="/board/hot">HOT 게시판</a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/board" style="color:#002c62;">문제 공유 게시판</a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/weekly" style="color:#002c62;">주간 인기 문제</a>
          </li>

          <li v-if="isAuthenticated" class="nav-item">
            <a class="nav-link" href="/myBook" style="color:#002c62;">마이 워크북</a>
          </li>
        </ul>
      </div>


      <form class="d-flex font-nanum-gothic-extrabold">
        <!--      <div v-if="role === 'ROLE_ADMIN' || role === 'ROLE_USER'">-->
        <!--        <div><b>{{ userName }}님 환영합니다.</b></div>-->
        <!--      </div>-->
        <button v-if="isAuthenticated" type="button" class="btn btn-primary my-2 my-sm-0 me-2 image-button" style="background-color:#002c62; border-color:#002c62;" @click="modalOpen = !modalOpen">
          <!--          모달 구현-->
          <img :src="userImg" alt="button image" class="button-image" style="filter: invert(100) brightness(100);">
        </button>

        <!-- 모달 창 -->
        <div v-if="modalOpen" class="custom-modal">
          <div class="modal-content p-4">
            <p><span class="font-nanum-gothic-bold">{{userName}}</span><span class="font-nanum-gothic-regular">님 환영합니다.</span></p>
            <span @click="button_logout()">로그아웃</span>
          </div>
        </div>

        <button class="btn btn-success my-2 my-sm-0" type="submit">
          <span class="font-nanum-gothic-bold">
            <a v-if="isAuthenticated" class="nav-link" href="/question">나만의 문제 생성</a>
            <a v-else class="nav-link" href="/login">로그인</a>
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import { jwtDecode } from "jwt-decode";
import userImage from '@/assets/person-18-32.png'; // 이미지 파일 import

export default {
  setup() {
    const modalOpen = ref(false);
    const isAuthenticated = computed(() => !!sessionStorage.getItem("jwt"));
    const userEmail = ref();
    const userName = ref();
    const role = ref();

    const userImg = ref(userImage);

    const token = sessionStorage.getItem("jwt")

    if (token) {

      const decoded = jwtDecode(token);  // JWT 디코딩
      userEmail.value = decoded.userEmail;  // 클레임에서 userEmail 추출
      userName.value = decoded.userName;
      role.value = decoded.role;

      const remainingTime = decoded.exp * 1000 - Date.now();

      if (remainingTime > 0) {
        setTimeout(() => logout(), remainingTime);  // 만료 시 로그아웃
      }
    }

    const button_logout = () => {
      // 스토어에서 토큰 삭제
      sessionStorage.removeItem("jwt");
      isAuthenticated.value = false;

      alert("로그아웃 되었습니다.");

      // 페이지를 완전히 새로고침하여 헤더/푸터 포함 모든 것을 리셋
      window.location.href = '/';
    };

    const logout = () => {
      // 스토어에서 토큰 삭제
      sessionStorage.removeItem("jwt");
      isAuthenticated.value = false;

      alert("30분이 지나 자동 로그아웃 되었습니다.");

      // 페이지를 완전히 새로고침하여 헤더/푸터 포함 모든 것을 리셋
      window.location.href = '/';
    };

    return {
      modalOpen,
      userImg,
      button_logout,
      logout,
      isAuthenticated,
      userEmail,
      userName,
      role
    }
  }
};
</script>

<style scoped>

.image-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden; /* 이미지가 버튼을 넘지 않도록 설정 */
}
.image-button img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 이미지 비율을 유지하며 버튼 크기에 맞추기 */
}

/* 커스텀 모달 스타일 */
.custom-modal {
  position: absolute;
  top: 70px; /* 버튼 아래에 위치하도록 */
  right: 100px;
  z-index: 1050; /* Bootstrap 모달의 z-index */
}

.modal-content {
  margin: 0 auto;
  width: fit-content;
  border: 2px solid #ddd; /* 테두리 색상 */
  background: white;
  border-radius: 5px;
  font-size: medium;
}
</style>
