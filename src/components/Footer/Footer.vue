<template>
  <hr class="footer-starter" />
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-left">
          <img src="/pictures/ensi.png" alt="ensi" class="footer-logo" />
          <div class="social-media">
            <a href="https://www.facebook.com/ENSIpageofficielle/?locale=fr_FR" target="_blank" rel="noopener noreferrer">
              <font-awesome-icon :icon="['fab', 'facebook']" />
            </a>
            <a href="https://ensit.ma/" target="_blank" rel="noopener noreferrer">
              <font-awesome-icon :icon="['fas', 'globe']" />
            </a>
            <a href="https://www.instagram.com/ensi_page_officielle/?hl=en" target="_blank" rel="noopener noreferrer">
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
          </div>
        </div>

        <div class="footer-right">
          <p>2 Rue Melilla, Tanger 90060 - Maroc</p>
          <p>+212 539942224</p>
          <p>contact@ensi.ma</p>
        </div>
      </div>

      <div class="footer-bottom">
        <hr class="footer-divider" />
        <div class="footer-bottom-content">
          <p>&copy; 2025 ENSI Vie Estudiantine. Tous droits réservés.</p>
          <router-link to="/terms" class="footer-link">Politique de Confidentialité</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-links {
  margin-top: 10px;
}

.footer-link {
  margin-right: 20px;
  text-decoration: none;
  color: #333;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>


<script setup lang="ts">
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faFacebook, faInstagram, faGlobe);
</script>

<style scoped>
@import './Footer.css';
</style>
