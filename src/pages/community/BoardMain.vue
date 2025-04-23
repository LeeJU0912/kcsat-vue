<template>
  <div>
    <div class="container font-nanum-gothic-regular">
      <!-- 게시글 테이블 -->
      <div class="table-responsive">
        <table class="table table-striped table-hover custom-table">
          <thead>
          <tr>
            <th class="col-md-1">번호</th>
            <th class="col-md-4">제목</th>
            <th class="col-md-2">문제 유형</th>
            <th class="col-md-1">작성자</th>
            <th class="col-md-2">작성일</th>
            <th class="col-md-1">조회수</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="posts.length > 0" v-for="post in posts" :key="post.pid">
            <td class="text-center align-middle">{{ post.pid }}</td>
            <td><div @click="postDetail(post.pid)">{{ post.title === "" ? "제목 없음" : post.title }}</div></td>
            <td class="text-center align-middle">{{ post.questionType }}</td>
            <td class="text-center align-middle">{{ post.username }}</td>
            <td class="text-center align-middle">{{ formatDate(post.postDate) }}</td>
            <td class="text-center align-middle">{{ post.postViewCount }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-center">
        <!-- 페이지네이션 -->
        <div v-if="totalPages">
          <ul class="pagination">
            <li :class="{ disabled: isFirstPage }" class="page-item">
              <a class="page-link" @click.prevent="prevPage" aria-label="Previous">
                <span aria-hidden="true">&lt;</span>
              </a>
            </li>

            <li v-for="page in totalPages" :key="page" :class="{ active: page - 1 === nowPage }" class="page-item">
              <a class="page-link" @click.prevent="goToPage(page - 1)">{{ page }}</a>
            </li>

            <li :class="{ disabled: isLastPage }" class="page-item">
              <a class="page-link" @click.prevent="nextPage" aria-label="Next">
                <span aria-hidden="true">&gt;</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 문제 유형 선택 및 검색 폼 -->
      <form @submit.prevent="searchBoard" class="d-flex justify-content-center align-items-center">
        <div class="form-group me-2">
          <select v-model="selectedType" id="type" class="form-control">
            <option :value="null">검색 유형</option>
            <option v-for="questionType in questionTypes" :key="questionType.key" :value="questionType.key">
              {{ questionType.value }}
            </option>
          </select>
        </div>

        <input
            class="form-control me-2 w-50"
            v-model="searchText"
            type="text"
            placeholder="글 본문 검색"
        />

        <button class="btn btn-secondary m-2" type="submit">
          검색
        </button>
      </form>
      <br>

      <!-- 글 쓰기 버튼 -->
      <router-link to="/board/post/new" class="btn btn-primary">글 쓰기</router-link>
      <br>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import api from "@/api.js";
import {usePostStorage} from "@/piniaStorage/postStorage.js";
import router from "@/router/index.js";

export default {
  setup() {
    const postDetailStorage = usePostStorage();
    const selectedType = ref(null);
    const searchText = ref("");

    const posts = ref([]);
    const nowPage = ref(0);
    const totalPages = ref(0);
    const isFirstPage = ref(true);
    const isLastPage = ref(false);

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


    const postList = async () => {
      try {
        const params = {
          page: nowPage.value,
        }
        const response = await api.get('/community/open/board', {params});

        posts.value = response.data.content;
        nowPage.value = response.data.number;
        totalPages.value = response.data.totalPages;
        isFirstPage.value = response.data.first;
        isLastPage.value = response.data.last;

        // await router.push("/board");
      } catch (error) {
        console.log(error);
      }
    }

    const searchBoard = async () => {
      try {
        const params = {
          page: nowPage.value,
        }

        // keyword와 type이 있을 경우에만 파라미터에 추가
        if (searchText.value) {
          params.keyword = searchText.value;
        }
        if (selectedType.value) {
          params.type = selectedType.value;
        }

        const response = await api.get('/community/open/board', {params});

        console.log(response);
        console.log(searchText.value)

        posts.value = response.data.content;
        nowPage.value = response.data.number;
        totalPages.value = response.data.totalPages;
        isFirstPage.value = response.data.first;
        isLastPage.value = response.data.last;

      } catch (error) {
        console.log(error);
      }
    }

    const prevPage = async () => {
      nowPage.value = nowPage.value - 1;
      await postList();
    }

    const nextPage = async () => {
      nowPage.value = nowPage.value + 1;
      await postList();
    }

    const goToPage = async (page) => {
      try {
        const params = {
          page: page,
          keyword: searchText.value,
          type: selectedType.value
        }
        const response = await api.get('/community/open/board', {params});

        posts.value = response.data.content;
        nowPage.value = response.data.number;
        totalPages.value = response.data.totalPages;
        isFirstPage.value = response.data.first;
        isLastPage.value = response.data.last;

        // await router.push("/board");
      } catch (error) {
        console.log(error);
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR'); // 한국식 연-월-일 형식
    }

    const postDetail = async (pid) => {
      try {
        const post_response = await api.get(`/community/board/post/${pid}`);
        const comment_response = await api.get(`/api/community/board/post/${pid}/comment`);
        postDetailStorage.setPostData(post_response.data);
        postDetailStorage.setCommentData(comment_response.data);

        // 요청 성공 시 페이지 이동
        await router.replace({path: `/board/post/${pid}`});
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(() => {
      postList();
    });

    return {
      posts,
      nowPage,
      totalPages,
      selectedType,
      questionTypes,
      searchText,
      isFirstPage,
      isLastPage,
      prevPage,
      nextPage,
      goToPage,
      searchBoard,
      postDetail,
      formatDate,
    }
  }
};
</script>

<style scoped>
.custom-table th {
  background-color: #002c77; /* 헤더 배경색 */
  color: white; /* 헤더 글자 색 */
  text-align: center; /* 중앙 정렬 */
}

.custom-table tbody tr:hover {
  background-color: #f2f4f8; /* 행 호버 효과 */
}

.custom-table td {
  vertical-align: middle; /* 텍스트 수직 정렬 */
  padding: 12px; /* 여백 조정 */
}

.custom-table {
  border-radius: 10px; /* 테이블 모서리 곡선 */
  overflow: hidden; /* 둥근 모서리에서 테두리가 넘치지 않게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}
</style>
