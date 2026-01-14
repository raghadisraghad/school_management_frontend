<template>
  <header>
    <RouterLink to="/" @click="closeMenu"><img alt="logo" class="logo" src="/pictures/ensi.png" width="125" height="125" /></RouterLink>
    <div class="wrapper">
      <button class="hamburger" :class="{ 'is-active': isMenuOpen }" @click="toggleMenu" aria-label="menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav :class="{ 'nav-open': isMenuOpen }">
        <div class="nav-links" :class="{ 'show': isMenuOpen }">
          <RouterLink to="/" @click="closeMenu">Accueil</RouterLink>
          <RouterLink to="/#about-us" @click="closeMenu">À propos</RouterLink>
          <RouterLink to="/#bureaux" @click="closeMenu">Bureaux</RouterLink>
          <RouterLink to="/#contact" @click="closeMenu">Contactez-nous</RouterLink>
          <RouterLink v-if="!user" to="/login" @click="closeMenu">Se connecter</RouterLink>
          <RouterLink v-if="!user" to="/signup" @click="closeMenu">S'inscrire</RouterLink>
          <button @click="toggleTheme" class="theme-toggle-btn">
            <i v-if="theme === 'light'" class="fas fa-sun"></i>
            <i v-if="theme === 'dark'" class="fas fa-moon"></i>
          </button>
          <div class="dropdown" v-if="user">
            <button @click="toggleDropdown" class="dropdown-button">
              <img alt="profile" :src="user.data?.picture || defaultPicture"/>
            </button>
            <ul v-if="isDropdownOpen" class="dropdown-menu">
              <li>
                <RouterLink :to="user.data?.role ? '/profile' : `/office/${user.data?._id}`" @click="closeDropdown">Profil</RouterLink>
              </li>
              <li v-if="isAdmin">
                <RouterLink to="/dashboard" @click="closeDropdown">Tableau de bord</RouterLink>
              </li>
              <li>
                <RouterLink to="/terms" @click="closeDropdown">Politique de Confidentialité</RouterLink>
              </li>
              <li>
                <RouterLink to="/" @click="handleLogout">Déconnexion</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { logout } from '@/services/AuthApi';

library.add(faSun, faMoon);

const theme = ref('light');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  if (theme.value === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.value = savedTheme;
  }
  if (theme.value === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  checkAuthentication();
});

const isAuthenticated = ref(false);
const user = ref(null);
const defaultPicture = new URL('/pictures/profile.png', import.meta.url).href;

const checkAuthentication = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
  }
};

const isAdmin = computed(() => user.value && user.value.data?.role === "0");
const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);

const toggleMenu = (event: Event) => {
  event.stopPropagation();
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const toggleDropdown = (event: Event) => {
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
  const dropdown = document.querySelector('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('open', isDropdownOpen.value);
  }
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const handleLogout = () => {
  closeDropdown();
  closeMenu();
  logoutFunction();
};

const logoutFunction = async () => {
  await logout();
  isAuthenticated.value = false;
  window.location.reload();
};

const handleClickOutside = (event: Event) => {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const dropdown = document.querySelector('.dropdown');

  if (isMenuOpen.value &&
    !nav?.contains(event.target as Node) &&
    !hamburger?.contains(event.target as Node)) {
    closeMenu();
  }

  if (dropdown && !dropdown.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

onMounted(() => {
  checkAuthentication();
});
</script>

<style scoped>
@import './Header.css';
</style>
