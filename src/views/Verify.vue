<template>
  <div class="verification-container">
    <h1>E-mail vérifié avec succès</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { verifyEmail } from '@/services/AuthApi';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const token = route.params.token;

  if (token) {
    verifyEmail(token)
      .then((response) => {
        if (response.status === 200) {
          router.push('/login');
        }
      })
      .catch((error) => {
        console.error('Verification failed', error);
      });
  }
});
</script>

<style scoped>
.verification-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(45deg, #6c63ff, #ff6363);
  animation: glow 2s infinite alternate;
}

h1 {
  font-size: 4rem;
  color: white;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  animation: textGlow 2s infinite alternate;
}

@keyframes glow {
  0% {
    background: linear-gradient(45deg, #ff6363, #6c63ff);
  }
  100% {
    background: linear-gradient(45deg, #ffb3ff, #ffcc66);
  }
}

@keyframes textGlow {
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
  }
  100% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6);
  }
}

/* Responsive Adjustments */
@media screen and (max-width: 768px) {
  .verification-container {
    flex-direction: column;
  }

  h1 {
    font-size: 3rem;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6), 0 0 24px rgba(255, 255, 255, 0.4);
  }
}

@media screen and (max-width: 480px) {
  .verification-container {
    height: auto;
    padding: 20px;
  }

  h1 {
    font-size: 2.5rem;
    text-shadow: 0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 255, 255, 0.6), 0 0 18px rgba(255, 255, 255, 0.4);
  }
}
</style>
