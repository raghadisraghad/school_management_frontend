<template>
  <div class="password-reset-container">
    <div class="form-wrapper">
      <h1>Entrez votre nouveau mot de passe</h1>
      <form @submit.prevent="handlePasswordReset">
        <div class="input-group">
          <input
            v-model="newPassword"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Nouveau mot de passe.."
            required
          />
          <span @click="togglePasswordVisibility" class="eye-icon">
            <i :class="passwordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
          </span>
        </div>
        <div class="input-group">
          <input
            v-model="confirmPassword"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Confirmez le mot de passe.."
            required
          />
          <span @click="togglePasswordVisibility" class="eye-icon">
            <i :class="passwordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
          </span>
        </div>
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';
import { useRoute, useRouter } from 'vue-router';
import { getUser, resetUserPassword } from '@/services/UserApi';
import { getOffice, resetOfficePassword } from '@/services/OfficeApi';
import { parseJwt } from '@/components/jwt';

const router = useRouter();
const route = useRoute();

const token = route.params.token;
const userType = route.params.user;
const newPassword = ref('');
const confirmPassword = ref('');
const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const validatePassword = () => {
  return newPassword.value === confirmPassword.value && newPassword.value.length >= 8;
};

const handlePasswordReset = async () => {
  if (!validatePassword()) {
    toast.info('Le mot de passe doit comporter au moins 8 caractères et doit correspondre au mot de passe de confirmation.', { autoClose: 3000, });
    return;
  }
  try {
    const decodedToken = parseJwt(token);
    let response = null;

    if (userType === "user") {
      response = await getUser(decodedToken.id);
    } else if (userType === "office") {
      response = await getOffice(decodedToken.id);
    }

    if (response.status === 200) {
      const data  = response.data;

      let updateResponse = null;
      if(userType === "user"){
        updateResponse = await resetUserPassword(data._id, {password: newPassword.value});
      }else if (userType === "office"){
        updateResponse = await resetOfficePassword(data ._id, {password: newPassword.value});
      }

      if (updateResponse.status === 200) {
        toast.success("Réinitialisation du mot de passe réussie", { autoClose: 3000, });
        router.push('/login');
      }
    } else {
      toast.error('Impossible de récupérer les données utilisateur/bureau.', { autoClose: 3000, });
    }
  } catch (error) {
    console.error('Password reset failed:', error);
  }
};
</script>

<style scoped>
.password-reset-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f4f8;
  padding: 20px;
}

.form-wrapper {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
}

h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

input {
  padding: 12px 16px;
  width: 90%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #6c63ff;
  outline: none;
}

.eye-icon {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.5rem;
}

button {
  padding: 12px 16px;
  width: 100%;
  font-size: 1.1rem;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1.5rem;
}

button:hover {
  background-color: #5a54e1;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 600px) {
  .form-wrapper {
    padding: 20px;
    max-width: 100%;
  }

  h1 {
    font-size: 1.8rem;
  }

  input, button {
    font-size: 1rem;
  }
}
</style>
