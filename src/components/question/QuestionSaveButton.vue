<template>
  <div class="inline-flex">
    <button
        v-if="saved"
        class="btn btn-success btn-sm mx-1"
        disabled
    >
      저장 완료
    </button>

    <button
        v-else
        class="btn btn-primary btn-sm mx-1"
        @click="emit('save')"
    >
      문제 저장하기
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  saved: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["save"]);
</script>
