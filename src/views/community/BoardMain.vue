<template>
  <div class="container font-nanum-gothic-regular">
    <PostTable :posts="posts" @clickPost="postDetail" />

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

    <br />
    <router-link to="/board/post/new" class="btn btn-primary">글 쓰기</router-link>
    <br />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import { questionTypesList } from "@/assets/constants/questionTypes";
import { moveToPostDetail } from "@/services/postService.js";

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

const fetchBoard = async (page = 0, keyword = null, type = null) => {
  try {
    const params = { page, keyword, type };
    const response = await api.get('/community/open/board', { params });

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
  await fetchBoard(nowPage.value, searchText.value, selectedType.value);
};

const prevPage = async () => {
  if (!isFirstPage.value) await fetchBoard(nowPage.value - 1, searchText.value, selectedType.value);
};

const nextPage = async () => {
  if (!isLastPage.value) await fetchBoard(nowPage.value + 1, searchText.value, selectedType.value);
};

const goToPage = async (page) => {
  await fetchBoard(page, searchText.value, selectedType.value);
};

const postDetail = async (pid) => {
  await moveToPostDetail(pid);
};

onMounted(() => {
  fetchBoard();
});
</script>