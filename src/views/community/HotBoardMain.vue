<template>
  <div class="container font-nanum-gothic-regular">
    <p class="lead">추천수 20 이상인 글들을 모아 두었습니다.</p>

    <PostTable :posts="posts" @clickPost="handlePostClick" />

    <Pagination
        :nowPage="nowPage"
        :totalPages="totalPages"
        :isFirstPage="isFirstPage"
        :isLastPage="isLastPage"
        @prevPage="prevPage"
        @nextPage="nextPage"
        @goToPage="goToPage"
    />

    <br />

    <SearchForm
        v-model:selectedType="selectedType"
        v-model:searchText="searchText"
        :questionTypesList="questionTypesList"
        @searchBoard="searchBoard"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { questionTypesList } from "@/assets/constants/questionTypes";
import { fetchHotBoardPosts, moveToPostDetail } from "@/services/postService";
import PostTable from "@/components/community/PostTable.vue";
import Pagination from "@/components/common/Pagination.vue";
import SearchForm from "@/components/community/SearchForm.vue";

const posts = ref([]);
const nowPage = ref(0);
const totalPages = ref(0);
const isFirstPage = ref(true);
const isLastPage = ref(false);
const selectedType = ref(null);
const searchText = ref("");

const loadHotPosts = async (page = 0, keyword = null, type = null) => {
  try {
    const response = await fetchHotBoardPosts(page, keyword, type);

    posts.value = response.data.content;
    nowPage.value = response.data.number;
    totalPages.value = response.data.totalPages;
    isFirstPage.value = response.data.first;
    isLastPage.value = response.data.last;
  } catch (error) {
    console.error(error);
  }
};

const searchBoard = async () => {
  await loadHotPosts(nowPage.value, searchText.value, selectedType.value);
};

const prevPage = async () => {
  if (!isFirstPage.value) await loadHotPosts(nowPage.value - 1, searchText.value, selectedType.value);
};

const nextPage = async () => {
  if (!isLastPage.value) await loadHotPosts(nowPage.value + 1, searchText.value, selectedType.value);
};

const goToPage = async (page) => {
  await loadHotPosts(page, searchText.value, selectedType.value);
};

const handlePostClick = async (pid) => {
  await moveToPostDetail(pid);
};

onMounted(() => {
  loadHotPosts();
});
</script>