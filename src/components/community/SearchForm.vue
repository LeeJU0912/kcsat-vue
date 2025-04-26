<template>
  <form @submit.prevent="$emit('searchBoard')" class="d-flex justify-content-center align-items-center">
    <div class="form-group me-2">
      <select v-model="selectedTypeModel" id="type" class="form-control">
        <option :value="null">검색 유형</option>
        <option v-for="type in questionTypesList" :key="type.key" :value="type.key">
          {{ type.value }}
        </option>
      </select>
    </div>

    <input
        class="form-control me-2 w-50"
        v-model="searchTextModel"
        type="text"
        placeholder="글 본문 검색"
    />

    <button class="btn btn-secondary m-2" type="submit">
      검색
    </button>
  </form>
</template>

<script setup>
import { defineProps, defineModel } from "vue";

const selectedTypeModel = defineModel('selectedType');
const searchTextModel = defineModel('searchText');

const props = defineProps({
  questionTypesList: {
    type: Array,
    required: true,
  },
});
</script>