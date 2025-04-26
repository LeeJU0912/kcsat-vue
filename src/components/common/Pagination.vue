<template>
  <div class="d-flex justify-content-center">
    <ul class="pagination" v-if="totalPages > 0">
      <li :class="{ disabled: isFirstPage }" class="page-item">
        <a class="page-link" @click.prevent="$emit('prevPage')">&lt;</a>
      </li>

      <li
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page - 1 === nowPage }"
          class="page-item"
      >
        <a class="page-link" @click.prevent="$emit('goToPage', page - 1)">
          {{ page }}
        </a>
      </li>

      <li :class="{ disabled: isLastPage }" class="page-item">
        <a class="page-link" @click.prevent="$emit('nextPage')">&gt;</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  nowPage: Number,
  totalPages: Number,
  isFirstPage: Boolean,
  isLastPage: Boolean,
});

defineEmits(["prevPage", "nextPage", "goToPage"]);
</script>