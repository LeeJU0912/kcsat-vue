<template>
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
        <td>
          <div @click="$emit('clickPost', post.pid)">
            {{ post.title || '제목 없음' }}
          </div>
        </td>
        <td class="text-center align-middle">{{ post.questionType }}</td>
        <td class="text-center align-middle">{{ post.username }}</td>
        <td class="text-center align-middle">{{ formatDate(post.postDate) }}</td>
        <td class="text-center align-middle">{{ post.postViewCount }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { formatDate } from "@/utils/dateUtils";

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

defineEmits(["clickPost"]);
</script>