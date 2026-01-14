<template>
  <div v-if="isLoading" class="loading-spinner">
    <i class="fas fa-spinner fa-spin"></i>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Spinner',
  props: {
    isLoading: {
      type: Boolean,
      required: true, // Whether the spinner should be visible
    },
    message: {
      type: String,
      default: 'Uploading images, please wait...', // Optional message to display
    },
  },
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px; /* Space between the spinner and the message */
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent background */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.fa-spinner {
  font-size: 2rem; /* Size of the spinner icon */
  color: #3498db; /* Color of the spinner */
}

p {
  margin: 0;
  font-size: 1rem;
  color: #333;
}
</style>
