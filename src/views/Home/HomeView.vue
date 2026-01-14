<template>
  <div>
    <section id="activities">
      <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
      <div class="events-container" v-if="events?.length > 0">
        <button class="slide-btn prev-btn" @click="prevEvent">&lt;</button>
        <div
          class="event-wrapper"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @mouseenter="pauseAutoSlide"
            @mouseleave="resumeAutoSlide"
        >
          <div
            class="event-card"
            v-for="(event, index) in events"
            :key="index"
            :style="{ transform: `translateX(-${currentEventIndex * 100}%)` }"
          >
            <div class="event-image">
              <div class="carousel">
                <div class="carousel-display">
                  <img
                    :src="event.posters[getCurrentIndex(event._id)]"
                    :alt="'Poster ' + (getCurrentIndex(event._id) + 1)"
                  />
                </div>
              </div>
              <div class="event-info-overlay">
                <RouterLink :to="`office/${event.office._id}`" class="event-info">
                  <p v-if="event.updateStatus" class="update">édité</p>
                  <h3>{{ event.name }}</h3>
                  <p class="event-description">{{ event.description }}</p>
                  <div class="event-details">
                    <p> 📅 Date:
                      <span class="span-event" v-if="formatDate(event.startDate) === formatDate(event.endDate)"> {{ formatDate(event.startDate) }} </span>
                      <span class="span-event" v-else> {{ formatDate(event.startDate) }} / {{ formatDate(event.endDate) }} </span>
                    </p>
                    <p>🕒 De: {{ formatTime(event.startDate) }} | <strong>à:</strong> {{ formatTime(event.endDate) }}</p>
                    <p>📍 Localisation: {{ event.location }}</p>
                    <p>
                      <span class="span-event" v-if="event.ticket?.intern">🎫 Prix Externes: {{ event.ticket.intern }} DH</span>
                      <span class="span-event" v-if="event.ticket?.intern && event.ticket?.extern"> | </span>
                      <span class="span-event" v-if="event.ticket?.extern">🎫 Prix Internes: {{ event.ticket.extern }} DH</span>
                    </p>
                    <p v-if="event.activities.length > 0">
                      <strong>Activités:</strong> {{ event.activities.join(', ') }}
                    </p>
                    <p v-if="event.collaborators.length > 0">
                      <strong>Collaborateurs:</strong> {{ event.collaborators.join(', ') }}
                    </p>
                    <p class="creer">Créer le {{ formatDate(event.dateCreated) }}</p>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <button class="slide-btn next-btn" @click="nextEvent">&gt;</button>
      </div>
      <div v-else class="no-events">
        <h1>Restez à l'écoute des événements à venir</h1>
      </div>
    </section>

    <section id="about-us" class="section about-us" style="background-color: var(--background);">
      <div class="about-content">
        <div class="image-container">
          <img src="/pictures/platform.png" alt="Platform Image" />
        </div>

        <div class="text-container">
          <span>
            <h2>À propos de nous</h2>
          </span>
          <h2>La vie étudiante à l'ENSI</h2>
          <p>
            vous permet de participer facilement à toutes les élections scolaires. Avec une interface simple et
            sécurisée, vous pouvez voter en toute confiance, suivre les résultats en temps réel, et garantir un
            processus transparent et équitable pour chaque membre de l'école.
          </p>
        </div>
      </div>
    </section>

    <section id="bureaux" v-if="offices?.length > 0">
      <span class="card-title">
        <h2>Nos Bureaux</h2>
      </span>
      <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
      <div class="section card-container" :disabled="isLoading">
        <div v-for="office in offices" :key="office._id" class="card">
          <img :src="office.picture || defaultPicture" :alt="office.abb">
          <h1>{{ office.abb }}</h1>
          <h1>{{ office.name }}</h1>
          <p>{{ office.slogan }}</p>
          <RouterLink :to="`office/${office._id}`" class="GoButton">Voir Le Bureau</RouterLink>
        </div>
      </div>
    </section>

    <section id="app" class="section app" style="background-color: var(--background);">
      <div class="app-content">
        <div class="image-container">
          <img src="/pictures/app.png" alt="Platform Image" />
        </div>

        <div class="text-container">
          <span>
            <h2>Version mobile</h2>
          </span>
          <h2>L'application est disponible</h2>
          <p>
            Accédez à notre plateforme de vote à tout moment ! Votez, suivez les résultats en direct et participez
            facilement au processus de décision.
          </p>
          <div class="image-buttons">
            <a href="https://apps.apple.com/us/app/example-app/id123456789">
              <img src="/pictures/app1.png" alt="Button Image" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.example.app">
              <img src="/pictures/app2.png" alt="Button Image" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section id="creators">
      <span class="card-title">
        <span>
          <h2>Développée par notre équipe de développeurs</h2>
        </span>
      </span>
      <div class="section creator-cards">
        <div class="creator-card">
          <img src="/pictures/raghad.jpg" alt="Creator 1">
          <h3>Raghad Chamlali</h3>
          <p>Ingenieur Informatique, Developpement Web et Mobile</p>
          <h3>Contact: </h3>
          <p>raghadchamlali03@gmail.com</p>
        </div>
      </div>
    </section>

    <section id="contact" class="section contact-map" style="background-color: var(--background);">
      <div class="contact-form">
        <span>
          <h2>Contactez-nous</h2>
        </span>
        <form @submit.prevent="contactUs">
          <input type="text" v-model="name" placeholder="Votre nom" required />
          <input type="email" v-model="email" placeholder="Votre E-mail" required />
          <textarea placeholder="Votre message" v-model="message" required></textarea>
          <button type="submit">Envoyer un message</button>
        </form>
        <p v-if="messageSent" class="success-message">Message envoyé avec succès!</p>
      </div>
      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.2644058227474!2d-5.8138912!3d35.7688809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b80a3882a5605%3A0x260433db0cd00c3d!2sEnsit!5e0!3m2!1sen!2sma!4v1736605493852!5m2!1sen!2sma"
          width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';
import Spinner from '@/components/Spinner/spinner.vue';
import { addContact } from '@/services/ContactApi';
import { allEvents } from '@/services/EventApi';
import { allOffices } from '@/services/OfficeApi';

const firstSection = ref<HTMLElement | null>(null);
const name = ref('');
const isLoading = ref(false);
const email = ref('');
const message = ref('');
const messageSent = ref(false);
const offices = ref([]);
const defaultPicture = new URL('/pictures/profile.png', import.meta.url).href;
const events = ref([]);
type CurrentIndices = {[key: string]: number;};
const currentIndices = ref<CurrentIndices>({});
const currentEventIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);
let autoSlideInterval;

onMounted(async () => {
  const eventData = await allEvents();
  if (eventData && eventData.data) {
    const filteredEvents = eventData.data.filter(event => event.active === true && event.archive === false);
    filteredEvents.forEach(item => {
      if (item.posters) {
        const pictureNames = item.posters.map(poster => poster.split('/').pop());
        item.posters = pictureNames.map(pictureName => `${import.meta.env.VITE_API_URL}/api/picture/office-images/${item.office._id}/${pictureName}`);
      }
      item.dateCreated = new Date(item.dateCreated).toISOString().replace('T', ' ').slice(0, 16);
      item.startDate = new Date(item.startDate).toISOString().replace('T', ' ').slice(0, 16);
      item.endDate = new Date(item.endDate).toISOString().replace('T', ' ').slice(0, 16);
    });
    events.value = filteredEvents;
    startAutoSlide();
  }
});

const formatDate = (dateTime: Date) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString();
};

const formatTime = (dateTime: Date) => {
  const date = new Date(dateTime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
  touchEndX.value = event.touches[0].clientX;
};

const handleTouchEnd = () => {
  const swipeThreshold = 50; // Minimum swipe distance to trigger a slide change
  const swipeDistance = touchEndX.value - touchStartX.value;

  if (swipeDistance > swipeThreshold) {
    prevEvent(); // Swipe right to go to the previous event
  } else if (swipeDistance < -swipeThreshold) {
    nextEvent(); // Swipe left to go to the next event
  }
};

onMounted(() => {
  if (firstSection.value) {
    firstSection.value.classList.add('visible');
  }
});

onMounted(() => {
  allOffices()
    .then((response) => {
      isLoading.value = true;
      offices.value = response.data
        .filter(office => office.status === true && office.archive === false)
        .map(office => {
          if (office.picture) {
            const pictureName = office.picture.split('/').pop();
            office.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${office._id}/${pictureName}`;
          }
          if (office.backgroundPicture) {
            const pictureName = office.backgroundPicture.split('/').pop();
            office.backgroundPicture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${office._id}/${pictureName}`;
          }
          return office;
        });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      offices.value = [];
    })
    . finally(() => {
      isLoading.value = false;
    });

  window.addEventListener('scroll', handleScroll);
});

const getCurrentIndex = (eventId: string): number => {
  return currentIndices.value[eventId] ?? 0;
};

const prev = (event: { _id: string; posters: string[] }) => {
  if (Array.isArray(event.posters) && event.posters.length > 0) {
    const eventId = event._id;
    if (currentIndices.value[eventId] === undefined) {
      currentIndices.value[eventId] = 0;
    }
    currentIndices.value[eventId] = (currentIndices.value[eventId] - 1 + event.posters.length) % event.posters.length;
  }
};

const next = (event: { _id: string; posters: string[] }) => {
  if (Array.isArray(event.posters) && event.posters.length > 0) {
    const eventId = event._id;
    if (currentIndices.value[eventId] === undefined) {
      currentIndices.value[eventId] = 0;
    }
    currentIndices.value[eventId] = (currentIndices.value[eventId] + 1) % event.posters.length;
  }
};

const nextEvent = () => {
  const currentEvent = events.value[currentEventIndex.value];

  if (currentIndices.value[currentEvent._id] < currentEvent.posters.length - 1) {
    next(currentEvent);
  } else {
    currentEventIndex.value = (currentEventIndex.value + 1) % events.value.length;
    currentIndices.value[currentEvent._id] = 0;
  }
};

const prevEvent = () => {
  const currentEvent = events.value[currentEventIndex.value];

  if (currentIndices.value[currentEvent._id] > 0) {
    prev(currentEvent);
  } else {
    currentEventIndex.value = (currentEventIndex.value - 1 + events.value.length) % events.value.length;
    const prevEvent = events.value[currentEventIndex.value];
    currentIndices.value[prevEvent._id] = prevEvent.posters.length - 1;
  }
};

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    const currentEvent = events.value[currentEventIndex.value];

    if(currentEvent){
      if (currentIndices.value[currentEvent._id] < currentEvent.posters.length - 1) {
        next(currentEvent);
      } else {
        nextEvent();
      }
    }
  }, 3000);
};

const pauseAutoSlide = () => {
  clearInterval(autoSlideInterval);
};

const resumeAutoSlide = () => {
  startAutoSlide();
};

onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  clearInterval(autoSlideInterval);
});

function handleScroll() {
  const sections = document.querySelectorAll('.section');
  const scrollPosition = window.scrollY + window.innerHeight;

  sections.forEach((section) => {
    if (section.offsetTop < scrollPosition) {
      section.classList.add('visible');
    }
  });
}

const contactUs = async () => {
  try {
    isLoading.value = true;
    const Contact = {
      name: name.value,
      email: email.value,
      message: message.value,
    }
    const response = await addContact(Contact);
    if (!response) {
      toast.info('Veuillez remplir tous les champs.', { autoClose: 3000, });
    } else {
      messageSent.value = true;
      name.value = '';
      email.value = '';
      message.value = '';

      setTimeout(() => {
        messageSent.value = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Failed:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import './home.css';
</style>
