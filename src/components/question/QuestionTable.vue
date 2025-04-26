<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover custom-table">
      <thead>
      <tr>
        <th class="col-md-1">번호</th>
        <th class="col-md-2">문제 타입</th>
        <th class="col-md-4">문제 본문</th>
        <th class="col-md-2">저장일</th>
        <th class="col-md-1">퍼간 횟수</th>
      </tr>
      </thead>
      <tbody>
      <!-- 데이터 없는 경우 -->
      <tr v-if="!questions?.length">
        <td class="text-center" colspan="5">등록된 문제가 없습니다.</td>
      </tr>

      <!-- 데이터가 있는 경우 -->
      <tr
          v-for="(question, index) in questions"
          :key="question.qid"
          @click="handleClickRow(question.qid)"
          style="cursor: pointer;"
      >
        <td class="text-center align-middle">{{ index + 1 }}</td>
        <td class="text-center align-middle">{{ question.questionType }}</td>
        <td class="text-start align-middle">
          {{ truncateText(question.mainText, 150) }}
        </td>
        <td class="text-center align-middle">
          {{ formatDate(question.createdDate) }}
        </td>
        <td class="text-center align-middle">
          {{ question.shareCounter }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { truncateText, formatDate } from "@/utils/textUtils";

const props = defineProps({
  questions: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["clickRow"]);

const handleClickRow = (qid) => {
  emit("clickRow", qid);
};
</script>

<style scoped>
.custom-table th {
  background-color: #000000;
  color: white;
  text-align: center;
}

.custom-table tbody tr:hover {
  background-color: #f2f4f8;
}

.custom-table td {
  vertical-align: middle;
  padding: 12px;
}
</style>
