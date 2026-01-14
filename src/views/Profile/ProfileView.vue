<template>
  <div class="profile-container">
    <div class="hamburger-menu" @click="toggleSidebar" :class="{ active: isSidebarOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="overlay" :class="{ active: isSidebarOpen }" @click="closeSidebar"></div>

    <div class="sidebar" :class="{ active: isSidebarOpen }">
      <h5>Paramètres</h5>
      <nav class="flex-column">
        <button @click="setActiveSection('profile')" :class="{ active: activeSection === 'profile' }">Profil</button>
        <button @click="setActiveSection('password')"
          :class="{ active: activeSection === 'password' }">Mot de passe</button>
        <button :disabled="isLoading" v-if="user.role !== '0'" class="delete-profile-btn" @click="handleDeleteProfile">Supprimer le profil</button>
      </nav>
    </div>

    <div class="form-content">
      <div class="profile-header">
        <h1>{{ activeSection === 'profile' ? 'Mettre à jour mon profil' : 'Mettre à jour le mot de passe' }}</h1>
        <div v-if="activeSection === 'profile'" class="avatar-section">
          <label for="avatar" class="avatar-upload-label">
            <img :src="avatarPreview || user.picture || defaultPicture" alt="User Avatar" />
            <span class="upload-icon">
              <i class="fa fa-camera"></i>
            </span>
          </label>
          <input id="avatar" type="file" style="display: none;" class="d-none" @change="handleAvatarChange" />
        </div>
      </div>

      <form @submit.prevent="submitHandler">
        <template v-if="activeSection === 'profile'">
          <div class="row">
            <div class="col-sm-6">
              <label for="firstName">Prénom</label>
              <input id="firstName" v-model="user.firstName" type="text" placeholder="Entrez le prénom" required />
            </div>
            <div class="col-sm-6">
              <label for="lastName">Nom de famille</label>
              <input id="lastName" v-model="user.lastName" type="text" placeholder="Entrez le nom de famille" required />
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <label for="username">Nom d'utilisateur</label>
              <input id="username" v-model="user.username" type="text" placeholder="Entrez le nom d'utilisateur" required />
            </div>
            <div class="col-sm-6">
              <label for="email">Adresse email</label>
              <input id="email" v-model="user.email" type="email" placeholder="Entrez l'email" required />
              <span v-if="!isEmailValid" class="error">Email invalide</span>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <label for="tel">Numéro de téléphone</label>
              <input id="tel" v-model="user.tel" type="text" maxlength="10" placeholder="Entrez le numéro de téléphone" required />
            </div>
            <div class="col-sm-6">
              <label for="birthDate">Date de naissance</label>
              <input id="birthDate" v-model="user.birthDate" type="date" required />
            </div>
          </div>
          <div class="row" v-if="user.role === '1'">
            <div class="col-sm-12">
              <label for="sector">Filière</label>
              <select v-model="user.sector" required>
                <option value="Génie Civil">Génie Civil</option>
                <option value="Génie Informatique: Ingénierie d'application Web et Mobile">Génie Informatique: Ingénierie d'application Web et Mobile</option>
                <option value="Génie Informatique: Ingénierie de la Cybersécurité">Génie Informatique: Ingénierie de la Cybersécurité</option>
                <option value="Génie Informatique: Sciences des données, Big Data et IA">Génie Informatique: Sciences des données, Big Data et IA</option>
                <option value="Génie Industriel">Génie Industriel</option>
                <option value="Ingénierie Cycle Préparatoire">Ingénierie Cycle Préparatoire</option>
                <option value="Management Licence en Commerce et Gestion">Management Licence en Commerce et Gestion</option>
                <option value="Management Master: Marketing, Communication et Stratégie Digitale">Management Master: Marketing, Communication et Stratégie Digitale</option>
                <option value="Management Master: Finance, Audit et Contrôle de Gestion">Management Master: Finance, Audit et Contrôle de Gestion</option>
                <option value="Management Master: Logistique et Supply Chain Management">Management Master: Logistique et Supply Chain Management</option>
                <option value="Management Master: Gouvernance, Management RH et Ingénierie de Formation">Management Master: Gouvernance, Management RH et Ingénierie de Formation</option>
                <option value="Management Public et Gouvernance Territoriale">Management Public et Gouvernance Territoriale</option>
              </select>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row">
            <div class="col-sm-6">
              <label for="currentPassword">Mot de passe actuel</label>
              <div class="password-input-container">
                <input id="currentPassword" v-model="currentPassword" :type="passwordVisible ? 'text' : 'password'"
                  placeholder="Entrez le mot de passe actuel" required />
                <span class="password-toggle" @click="togglePasswordVisibility">
                  <i class="fa" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"></i>
                </span>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="newPassword">Nouveau mot de passe</label>
              <div class="password-input-container">
                <input id="newPassword" v-model="newPassword" :type="passwordVisible ? 'text' : 'password'"
                  placeholder="Entrez un nouveau mot de passe" required />
                <span class="password-toggle" @click="togglePasswordVisibility">
                  <i class="fa" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <label for="confirmPassword">Vérifier le nouveau mot de passe</label>
              <div class="password-input-container">
                <input id="confirmPassword" v-model="confirmPassword" :type="passwordVisible ? 'text' : 'password'"
                  placeholder="Entrez à nouveau le nouveau mot de passe" required />
                <span class="password-toggle" @click="togglePasswordVisibility">
                  <i class="fa" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"></i>
                </span>
              </div>
            </div>
          </div>
        </template>

        <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
        <div class="center">
          <button type="submit"  :disabled="isLoading" class="btn btn-primary mt-3">Mise à jour</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';
import router from '@/router';
import { prompt } from '@/components/prompt';
import { uploadAvatar } from "@/services/PictureApi";
import { parseJwt } from '@/components/jwt';
import Spinner from '@/components/Spinner/spinner.vue';
import { checkUsernameExistsOnce, getUser, updateUser, deleteUser } from "@/services/UserApi";

const isLoading = ref(false);
const activeSection = ref("profile");
const avatar = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const defaultPicture = new URL('/pictures/profile.png', import.meta.url).href;
const passwordVisible = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isSidebarOpen = ref(false);
const isUsernameUnique = ref(true);

const user = reactive({
  _id: 0,
  role: "",
  picture: null,
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  tel: "",
  birthDate: "",
  sector: "",
});

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  if (storedUser && storedUser.data._id) {
    storedUser.data.birthDate = new Date(storedUser.data.birthDate).toISOString().split('T')[0]
    Object.assign(user, storedUser.data);
  }
});

const setActiveSection = (section: string) => {
  activeSection.value = section;
  closeSidebar();
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const handleAvatarChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    avatar.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const submitHandler = async () => {
  try {
    isLoading.value = true;
    await usernameValid(user.username);
    if (!isUsernameUnique.value) return;
    await usernameValid(user.email);
    if (!isUsernameUnique.value) return;
    if (avatar.value && activeSection.value === "profile") {
      try {
        console.log(avatar.value);
        const formData = new FormData();
        formData.append("avatar", avatar.value);
        const { data: { url } } = await uploadAvatar(user._id, formData);
        user.picture = url;
      } catch (error) {
        console.error(error);
        return;
      } finally {
        isLoading.value = false;
      }
    }

    if (activeSection.value === "profile") {
      await updateUser(user._id, user);
      const decodedToken = parseJwt(localStorage.getItem('token'));
      const updatedUser = await getUser(decodedToken.userId);

      if (updatedUser.data.picture) {
        const pictureName = updatedUser.data.picture.split('/').pop();
        updatedUser.data.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${updatedUser.data._id}/${pictureName}`;
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success("Profil mis à jour avec succès!", { autoClose: 3000, });
    } else {
      if (newPassword.value !== confirmPassword.value) {
        return;
      }
      await updateUser(user._id, { password: newPassword.value, currentPassword: currentPassword.value });
      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
      toast.success("Mot de passe mis à jour avec succès!", { autoClose: 3000, });
    }
    window.location.reload();
  } catch (error) {
    toast.error("Le nom d'utilisateur ou l'e-mail existe déjà!", { autoClose: 3000, });
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const isEmailValid = computed(() => {
  const email = user.email;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const domainCheck = /@ensi\.ma$/;
  return emailPattern.test(email) && domainCheck.test(email);
});

const usernameValid = async (username: string) => {
  try {
    await checkUsernameExistsOnce(username,user._id);
    isUsernameUnique.value = true;
  } catch (error) {
    console.error(error);
    isUsernameUnique.value = false;
    toast.error("Nom d'utilisateur/e-mail utilisé!!!", { autoClose: 3000, });
  }
};

const handleDeleteProfile = async () => {
  const enteredPassword = await prompt("Veuillez entrer votre mot de passe pour confirmer:");
  if (enteredPassword) {
    try {
      isLoading.value = true;
      const response = await deleteUser(user._id, enteredPassword);
      toast.success(response.data.message || "Profil supprimé avec succès!", { autoClose: 3000, });
      localStorage.clear();
      window.location.reload();
      router.push("/");
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message || "Une erreur s'est produite.";
        toast.error(message, { autoClose: 3000, });
      } else {
        console.error("Error deleting profile:", error);
        toast.error("Une erreur inattendue s'est produite.", { autoClose: 3000, });
      }
    } finally {
      isLoading.value = false;
    }
  }
};

</script>

<style scoped>
@import './profile.css';
</style>
