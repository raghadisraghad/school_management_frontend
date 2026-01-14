<template>
  <div class="login-page">
    <div v-show="showLoginForm" class="form-container">
      <h1>Se connecter</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Nom d'utilisateur/E-mail</label>
          <input type="text" v-model="username" placeholder="entrez votre nom d'utilisateur/email.." required />
        </div>
        <div>
          <label for="password">Mot de passe</label>
          <div class="password-container">
            <input :type="passwordVisible ? 'text' : 'password'" v-model="password" required
              placeholder="entrez votre mot de passe.." id="password" />
            <i class="fa" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'" @click="togglePasswordVisibility"></i>
          </div>
        </div>
        <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
        <button :disabled="isLoading" type="submit">Se connecter</button>
        <div class="links">
          <span @click="toggleForm">Mot de passe oublié?</span><br>
          Vous n'avez pas de compte ?<router-link to="/signup" @click="toggleForm" class="links"> Registre</router-link>
        </div>
      </form>
    </div>

    <div v-show="showForgotPasswordForm" class="form-container">
      <h1>Mot de passe oublié</h1>
      <form @submit.prevent="handleForgotPassword">
        <div>
          <label for="email">Email</label>
          <input type="email" v-model="email" placeholder="entrez votre email.." required />
        </div>
        <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
        <button :disabled="isLoading" type="submit">Soumettre</button>
        <div class="links">
          <span @click="toggleForm">Retour à la connexion</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';
import router from '@/router';
import { parseJwt } from '@/components/jwt';
import Spinner from '@/components/Spinner/spinner.vue';
import { forgotPassword } from '@/services/AuthApi';
import { login } from '@/services/AuthApi';
import { getOffice } from '@/services/OfficeApi';
import { getUser } from '@/services/UserApi';

onMounted(() => {
  if (localStorage.getItem('token')) {
    router.push('/');
  }
});

const isLoading = ref(false);
const username = ref('');
const password = ref('');
const email = ref('');
const errorMessage = ref('');
const passwordVisible = ref(false);
const showLoginForm = ref(true);
const showForgotPasswordForm = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const toggleForm = () => {
  showLoginForm.value = !showLoginForm.value;
  showForgotPasswordForm.value = !showForgotPasswordForm.value;
};

const handleForgotPassword = async () => {
  try {
    isLoading.value = true;
    const response = await forgotPassword(email.value);
    if (response.status === 200) {
      toast.success(response.data?.message, { autoClose: 3000, });
      email.value = '';
      router.push('/login');
    } else {
      toast.error(response.data?.message || "Une erreur s'est produite.", { autoClose: 3000, });
    }
  } catch (error) {
    console.error('La connexion a échoué:', error);
    toast.error(error.response?.data?.message, { autoClose: 3000, });
    errorMessage.value = error.response?.data?.message;
  } finally {
    isLoading.value = false;
  }
};

const handleLogin = async () => {
  try {
    isLoading.value = true;
    const response = await login({ username: username.value, password: password.value });
    if (response.status === 400) {
      const errorMessageFromBackend = response.data?.message || "An error occurred.";
      toast.error(errorMessageFromBackend, { autoClose: 3000, });
      return;
    } else {
      const { message, token, type } = response.data;
      const decodedToken = parseJwt(token);
      let user ;

      if(type==="office"){
        user = await getOffice(decodedToken.userId);
      }else if(type==="user"){
        user = await getUser(decodedToken.userId);
      }

      if (user.data.picture) {
        const pictureName = user.data.picture.split('/').pop();
        user.data.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${user.data._id}/${pictureName}`;
      }

      if (user.data.backgroundPicture) {
        const pictureName = user.data.backgroundPicture.split('/').pop();
        user.data.backgroundPicture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${user.data._id}/${pictureName}`;
      }

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      errorMessage.value = '';
      window.location.reload();
      router.push('/');
    }
  } catch (error) {
    console.error('Login failed:', error);
    toast.error(error.response?.data?.message || "Nom d'utilisateur ou mot de passe invalide.", { autoClose: 3000, });
    errorMessage.value = error.response?.data?.message || "Invalid username or password.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import './auth.css';
</style>
