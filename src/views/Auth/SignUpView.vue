<template>
  <div class="sign-up">

    <div class="form-page">
      <div class="form-selector">
        <button :class="{ 'active': selectedForm === 'user' }" @click="selectForm('user')">Créer un utilisateur</button>
        <button :class="{ 'active': selectedForm === 'office' }" @click="selectForm('office')">Créer un bureau</button>
      </div>

      <div v-if="selectedForm === 'user'" class="form-container">
        <span>
          <h1>Créer un utilisateur</h1>
        </span>
        <form @submit.prevent="handleSubmit">
          <div v-if="step === 1" class="step">
            <h2>Première étape : Informations Générales</h2>
            <div class="input-group">
              <div>
                <label for="firstName">Prénom</label>
                <input type="text" v-model="user.firstName" placeholder="Prénom" required />
              </div>
              <div>
                <label for="lastName">Nom de famille</label>
                <input type="text" v-model="user.lastName" placeholder="Nom de famille" required />
              </div>
            </div>
              <div>
                <label for="username">Nom d'utilisateur</label>
                <input type="text" v-model="user.username" placeholder="Nom d'utilisateur"
                  @blur="usernameValid(user.username)" required />
              </div>
            <button @click="nextStep" :disabled="!user.username || !user.firstName || !user.lastName"
              :class="{ 'disabled-button': !user.username || !user.firstName || !user.lastName }">
              Suivant
            </button>
          </div>

          <div v-if="step === 2" class="step">
            <h2>2ème Étape : Création du Compte</h2>
            <div class="input-group">
              <div class="password-container">
                <label for="password">Mot de passe</label>
                <input :type="passwordVisible ? 'text' : 'password'" v-model="user.password" placeholder="Mot de passe"
                  required />
                <i class="fa" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"
                  @click="togglePasswordVisibility"></i>
              </div>
              <div>
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input :type="passwordVisible ? 'text' : 'password'" v-model="confirmPassword"
                  placeholder="Confirmer le mot de passe" @blur="{ validatePassword(); passwordsMatch(); }" required />
              </div>
            </div>
            <button @click="nextStep"
              :disabled="!isPasswordValid || !confirmpasswordValid() || !isUsernameUnique"
              :class="{ 'disabled-button': !isPasswordValid || !confirmpasswordValid() || !isUsernameUnique }">
              Suivant
            </button>
            <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 3" class="step">
            <h2>3ème Étape : Informations Personnelles</h2>
            <div class="input-group">
              <div>
                <label for="email">Email</label>
                <input type="email" v-model="user.email" placeholder="Email" required
                  :class="{ 'invalid': !isEmailValid }" @blur="usernameValid(user.email)" />
                <span v-if="!isEmailValid" class="error">Email invalide</span>
              </div>
              <div>
                <label for="birthDate">Date de naissance</label>
                <input type="date" v-model="user.birthDate" placeholder="Date de naissance" max="2009-12-31" required />
              </div>
              <div>
                <label for="tel">Numéro de téléphone</label>
                <input type="tel" v-model="user.tel" placeholder="Numéro de téléphone" required
                  :class="{ 'invalid': !validatePhone }" maxlength="10" />
                <span v-if="!validatePhone" class="error">Numéro invalide (doit commencer par 0 et avoir 10
                  chiffres)</span>
              </div>
            </div>
            <button @click="nextStep" :disabled="!validatePhone || !user.email || !user.birthDate || !isEmailValid || !isUsernameUnique"
              :class="{ 'disabled-button': !validatePhone || !user.email || !user.birthDate || !isEmailValid || !isUsernameUnique }">Suivant</button>
            <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 4" class="step">
            <h2>4ème Étape : Détails Académiques</h2>
            <div class="input-group">
              <div>
                <label for="level">Niveau</label>
                <input type="number" v-model="user.level" min="1" maxlength="5" placeholder="Niveau" required />
              </div>
              <div>
                <label for="sector">Secteur</label>
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
            <button @click="nextStep" :disabled=" !user.level || !user.sector"
              :class="{ 'disabled-button':  !user.level || !user.sector }">Suivant</button>
            <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 5" class="step">
            <h2>Étape Final : Termes et Soumission</h2>
            <div class="input-group">
              <div class="terms-box">
                <p>
                  Acceptez les termes et la politique de notre site web pour compléter votre inscription.
                </p>
                <a href="/terms" target="_blank">Voir les termes et conditions</a>
                <label>
                  J'accepte les termes et conditions <input type="checkbox" v-model="acceptTerms" />
                </label>
              </div>
            </div>
            <button :disabled="!acceptTerms" @click="submitForm" :class="{ 'disabled-button': !acceptTerms }"> Soumettre
            </button>
            <button @click="previousStep">Précédent</button>
          </div>

        </form>
        <div class="links">
          Vous avez déjà un compte ? <router-link to="/login" class="links">Se connecter</router-link>
        </div>
      </div>

      <div v-if="selectedForm === 'office'" class="form-container">
        <span>
          <h1>Demande de Creation d'un bureau</h1>
        </span>
        <form @submit.prevent="handleSubmit">
          <div v-if="step === 1" class="step">
            <h2>Lors de la creation du bureau on vous demande de saisir 5 members min, pour faire cela il faut avoir les membres deja enregistrer comme utilisateur dans notre siteweb</h2>
            <button @click="nextStep">Daccord</button>
          </div>

          <div v-if="step === 2" class="step">
            <h2>Premier Étape : Informations sur le Bureau</h2>
            <div class="input-group">
              <div>
                <label for="officeName">Nom du bureau</label>
                <input type="text" v-model="office.name" placeholder="Nom du bureau" required
                  @blur="officeNameValid(office.name)" />
              </div>
              <div>
                <label for="abb">Abréviation</label>
                <input type="text" v-model="office.abb" placeholder="Abréviation" required />
              </div>
              <div>
                <label for="description">Description</label>
                <input type="text" v-model="office.description" placeholder="Description" required />
              </div>
            </div>
            <button @click="nextStep" :disabled="!office.description || !office.name || !office.abb || !isUsernameUnique"
              :class="{ 'disabled-button':!office.description || !office.name || !office.abb || !isUsernameUnique }">Suivant</button>
              <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 3" class="step">
            <h2>2ème Étape : Coordonnées du Bureau</h2>
            <div class="input-group">
              <div>
                <label for="email">E-mail</label>
                <input type="email" v-model="office.email" placeholder="E-mail" required
                  :class="{ 'invalid': !isEmailValid }" @blur="officeNameValid(office.email)" />
                <span v-if="!isEmailValid" class="error">E-mail invalide</span>
              </div>
              <div>
                <label for="slogan">Slogan</label>
                <input type="text" v-model="office.slogan" placeholder="Slogan" required />
              </div>
            </div>
            <button @click="nextStep" :disabled="!office.email || !office.slogan || !isUsernameUnique || !isEmailValid"
              :class="{ 'disabled-button': !office.email || !office.slogan || !isUsernameUnique || !isEmailValid }">Suivant</button>
            <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 4" class="step">
            <h2>3ème Étape : Paramètres de Sécurité</h2>
            <div class="input-group">
              <div class="password-container">
                <label for="password">Mot de passe</label>
                <input :type="passwordVisible ? 'text' : 'password'" v-model="office.password"
                  placeholder="Mot de passe" required />
                <i class="fa" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"
                  @click="togglePasswordVisibility"></i>
              </div>
              <div>
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input :type="passwordVisible ? 'text' : 'password'" v-model="confirmPassword"
                  placeholder="Confirmer le mot de passe" @blur="{ validatePassword(); passwordsMatch(); }" required />
              </div>
            </div>
            <button @click="nextStep" :disabled="!isPasswordValid || !confirmpasswordValid()"
              :class="{ 'disabled-button': !isPasswordValid || !confirmpasswordValid() }">
              Suivant
            </button>
            <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 5" class="step">
            <h2>5ème Étape: Choix du président(e)</h2>
            <div class="input-group">
              <div class="custom-dropdown">
                <label for="vice">Président(e)</label>
                <input v-model="searchQuery" @focus="isOpen = true" @blur="closeDropdown" placeholder="Recherche Président(e)" />
                <div v-if="isOpen" class="dropdown-options">
                  <div v-for="user in filteredUsers" :key="user._id" @mousedown="selectOption(user, 'president')" class="option" >
                    {{ user.firstName }} {{ user.lastName }} ({{ user.sector }})
                  </div>
                </div>
              </div>
            </div>
            <button @click="nextStep" :disabled="!office.president" :class="{ 'disabled-button': !office.president }">Suivant</button>
            <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 6" class="step">
            <h2>6ème Étape: Choix du vice-président(e)</h2>
            <div class="input-group">
              <div class="custom-dropdown">
                <label for="vice">Vice-président(e)</label>
                <input v-model="searchQuery" @focus="isOpen = true" @blur="closeDropdown" placeholder="Recherche vice-président(e)" />
                <div v-if="isOpen" class="dropdown-options">
                  <div v-for="user in availableUsers" :key="user._id" @mousedown="selectOption(user, 'vice')" class="option" >
                    {{ user.firstName }} {{ user.lastName }} ({{ user.sector }})
                  </div>
                </div>
              </div>
            </div>
              <button @click="nextStep" :disabled="!office.vice" :class="{ 'disabled-button': !office.vice }">Suivant</button>
              <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 7" class="step">
            <h2>7ème Étape: Choix du secrétaire</h2>
            <div class="input-group">
              <div class="custom-dropdown">
                <label for="vice">Secrétaire</label>
                <input v-model="searchQuery" @focus="isOpen = true" @blur="closeDropdown" placeholder="Recherche secrétaire" />
                <div v-if="isOpen" class="dropdown-options">
                  <div v-for="user in availableUsers" :key="user._id" @mousedown="selectOption(user, 'secretary')" class="option" >
                    {{ user.firstName }} {{ user.lastName }} ({{ user.sector }})
                  </div>
                </div>
              </div>
            </div>
              <button @click="nextStep" :disabled="!office.secretary" :class="{ 'disabled-button': !office.secretary }">Suivant</button>
              <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 8" class="step">
            <h2>8ème Étape: Ajout des pôles</h2>
            <h3>Ajoutez au moins deux pôles</h3>

            <div>
              <label for="poleName">Nom du pôle</label>
              <input type="text" v-model="newPole.name" placeholder="Recherche le nom du pôle" required />
            </div>

            <div>
              <label for="poleDescription">Description du pôle</label>
              <input type="text" v-model="newPole.description" placeholder="Recherche la description du pôle" required />
            </div>

            <div>
              <div class="custom-dropdown">
                <label for="res">Sélectionner l'utilisateur responsable</label>
                <input v-model="searchQuery" @focus="isOpen = true" @blur="closeDropdown" placeholder="Recherche l'utilisateur responsable" />
                <div v-if="isOpen" class="dropdown-options">
                  <div v-for="user in availableUsers" :key="user._id" @mousedown="selectOptionPoleRes(user)" class="option" >
                    {{ user.firstName }} {{ user.lastName }} ({{ user.sector }})
                  </div>
                </div>
              </div>
            </div>

            <button @click="addPole" :disabled="!newPole.name || !newPole.res"> Ajouter un pôle </button>

            <div v-if="office.poles.length > 0">
              <h3>Tous les pôles</h3>
              <ul>
                <li v-for="(pole, index) in office.poles" :key="index">
                  {{ pole.name }} (Responsable: {{ getUserName(pole.res) }})
                  <button @click="removePole(index)">Retirer</button>
                </li>
              </ul>
            </div>

            <button @click="nextStep" :disabled="office.poles.length < 2" :class="{ 'disabled-button': office.poles.length < 2 }">Suivant</button>
            <button @click="previousStep">Précédent</button>
          </div>

          <div v-if="step === 9" class="step">
            <h2>Étape finale : Finalisation de l'inscription</h2>
            <div class="input-group">
              <div class="terms-box">
                <p>
                  Acceptez les termes et la politique de notre site web pour compléter votre inscription.
                </p>
                <a href="/terms" target="_blank">Voir les termes et conditions</a>
                <label>
                  J'accepte les termes et conditions <input type="checkbox" v-model="acceptTerms" />
                </label>
              </div>
            </div>
            <button :disabled="!acceptTerms" @click="submitFormOffice" :class="{ 'disabled-button': !acceptTerms }">Soumettre</button>
            <button @click="previousStep">Précédent</button>
          </div>
          <div class="links">
            Vous avez déjà un compte ? <router-link to="/login" class="links">Se connecter</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, computed, onMounted } from 'vue';
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';
import { register } from '@/services/AuthApi';
import { checkOfficeName, addOffice } from '@/services/OfficeApi';
import { checkUsername, allUsers } from '@/services/UserApi';

const selectedForm = ref<'user' | 'office'>('user');
const step = ref(1);
const acceptTerms = ref(false);
const confirmPassword = ref('');
const isPasswordValid = ref(false);
const passwordVisible = ref(false);
const searchQuery = ref('');
const isOpen = ref(false);
const selectedUser = ref<any>(null);
const isUsernameUnique = ref(true);

onMounted(() => {
  if (localStorage.getItem('token')) {
    router.push('/');
  }
});

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const user = ref({
  role: '1',
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  email: '',
  birthDate: '',
  tel: '',
  level: '',
  sector: '',
  status: false
});

const office = ref({
  name: '',
  abb: '',
  email: '',
  slogan: '',
  description: '',
  password: '',
  president: "",
  vice: "",
  secretary: "",
  poles: [] as Pole[]
});

const newPole = ({
  name:"",
  res:"",
  description:"",
  members:[],
});

const users = ref<any[]>([]);

onMounted(async () => {
  const userData = await allUsers();
  if (userData && userData.data) {
    const updatedUsers = userData.data.filter(user => user.role === '1').map(user => {
      if (user.picture) {
        const pictureName = user.picture.split('/').pop();
        user.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${user._id}/${pictureName}`;
      }
      return user;
    });
    users.value = updatedUsers;
  }
});

const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

const selectOption = (user: any, attribute: keyof typeof office.value) => {
  office.value[attribute] = user._id;
  selectedUser.value = user;
  searchQuery.value = `${user.firstName} ${user.lastName}`;
  isOpen.value = false;
  console.log(office.value[attribute]);
};

const selectOptionPoleRes = (user: any) => {
  newPole.res = user._id;
  selectedUser.value = user;
  searchQuery.value = `${user.firstName} ${user.lastName}`;
  isOpen.value = false;
  console.log(newPole.res);
};

const availableUsers = computed(() => {
  const excludedIds = new Set<string>();

  if (office.value.president) excludedIds.add(office.value.president);
  if (office.value.vice) excludedIds.add(office.value.vice);
  if (office.value.secretary) excludedIds.add(office.value.secretary);

  office.value.poles.forEach((pole) => {
    if (pole.res) excludedIds.add(pole.res);
    pole.members.forEach((memberId: string) => excludedIds.add(memberId));
  });

  return filteredUsers.value.filter((user) => !excludedIds.has(user._id));
});

const closeDropdown = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 200); // Delay to allow click events to register
};

const addPole = () => {
  console.log(newPole);
  if (newPole.name && newPole.res) {
    office.value.poles.push({
      name: newPole.name,
      res: newPole.res,
      description: newPole.description,
      members: [],
    });
    newPole.name = "";
    newPole.res = "";
    newPole.description = "";
    searchQuery.value = "";
  } else {
    toast.error("Veuillez fournir un nom de poteau valide et un utilisateur responsable.", { autoClose: 3000, });
  }
};

const removePole = (index: number) => {
  office.value.poles.splice(index, 1);
};

const getUserName = (userId: string) => {
  const user = users.value.find(u => u._id === userId);
  return user ? `${user.firstName} ${user.lastName}` : '';
};

const validatePassword = () => {
  const password = user.value.password ? user.value.password : office.value.password;
  isPasswordValid.value = password.length >= 8 && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!isPasswordValid.value) {
    toast.info('Le mot de passe doit comporter au moins 8 caractères et contenir un chiffre et un caractère spécial.', { autoClose: 3000, });
    return false;
  }
  return true;
};

const passwordsMatch = () => {
  const password = user.value.password ? user.value.password : office.value.password;
  if (password === confirmPassword.value) {
    return true;
  } else {
    toast.error('Les mots de passe ne correspondent pas.', { autoClose: 3000, });
    return false;
  }
};

const confirmpasswordValid = () => {
  const password = user.value.password ? user.value.password : office.value.password;
  return password === confirmPassword.value;
};

const isEmailValid = computed(() => {
  const email = user.value.email ? user.value.email : office.value.email;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const domainCheck = /@ensi\.ma$/;
  return emailPattern.test(email) && domainCheck.test(email);
});

const usernameValid = async (username: string) => {
  try {
    await checkUsername(username);
    isUsernameUnique.value = true;
  } catch (error) {
    console.error(error);
    isUsernameUnique.value = false;
    toast.error("Nom d'utilisateur/e-mail utilisé", { autoClose: 3000, });
  }
};

const officeNameValid = async (username: string) => {
  try {
    await checkOfficeName(username);
    isUsernameUnique.value = true;
  } catch (error) {
    console.error(error);
    isUsernameUnique.value = false;
    toast.error("Nom/E-mail déjà utilisé", { autoClose: 3000, });
  }
};

const validatePhone = () => {
  const phone = user.value.tel;
  if (!/^0\d{9}$/.test(phone)) {
    toast.info('Le numéro de téléphone doit commencer par 0 et contenir exactement 10 chiffres.', { autoClose: 3000, });
    return false;
  }
  return true;
};

const selectForm = (form: 'user' | 'office') => {
  selectedForm.value = form;
  step.value = 1;
  passwordVisible.value = false;
  acceptTerms.value = false;
  confirmPassword.value = '';
};

const nextStep = () => {
  if (selectedForm.value === 'user' && step.value < 5) {
    step.value++;
  } else if (selectedForm.value === 'office' && step.value < 10) {
    step.value++;
  }
  if(step.value === 5 && office.value.president){
    selectedUser.value = users.value.find((user) => user._id === office.value.president);
    searchQuery.value = `${selectedUser.value.firstName} ${selectedUser.value.lastName}`;
  }else if(step.value === 6 && office.value.vice){
    selectedUser.value = users.value.find((user) => user._id === office.value.vice);
    searchQuery.value = `${selectedUser.value.firstName} ${selectedUser.value.lastName}`;
  }else if(step.value === 7 && office.value.secretary){
    selectedUser.value = users.value.find((user) => user._id === office.value.secretary);
    searchQuery.value = `${selectedUser.value.firstName} ${selectedUser.value.lastName}`;
  }else{
    selectedUser.value = '';
    searchQuery.value = ''
  }
};

const previousStep = () => {
  if (step.value > 1) {
    step.value--;
  }
  if(step.value === 5){
    selectedUser.value = users.value.find((user) => user._id === office.value.president);
    searchQuery.value = `${selectedUser.value.firstName} ${selectedUser.value.lastName}`;
  }else if(step.value === 6){
    selectedUser.value = users.value.find((user) => user._id === office.value.vice);
    searchQuery.value = `${selectedUser.value.firstName} ${selectedUser.value.lastName}`;
  }else if(step.value === 7){
    selectedUser.value = users.value.find((user) => user._id === office.value.secretary);
    searchQuery.value = `${selectedUser.value.firstName} ${selectedUser.value.lastName}`;
  }
};

const submitForm = async () => {
  try {
    const data = JSON.stringify(user.value);
    const formData = JSON.parse(data);
    const response = await register(formData);
    if (!response) {
      toast.error('Réessayez plus tard!', { autoClose: 3000, });
    } else {
      toast.success('Inscrit avec succès!', { autoClose: 3000, });
      router.push('/login');
    }
  } catch (error) {
    console.error("L'inscription a échoué:", error);
  }
};

const submitFormOffice = async () => {
  try {
    const data = JSON.stringify(office.value);
    const formData = JSON.parse(data);
    const response = await addOffice(formData);
    if (!response) {
      toast.error('Réessayez plus tard!', { autoClose: 3000, });
    } else {
      toast.info('Vous recevrez un e-mail lorsque votre demande sera approuvée', { autoClose: 3000, });
      router.push('/login');
    }
  } catch (error) {
    console.error('Creating Office Demande failed:', error);
  }
};
</script>

<style scoped>
@import './auth.css';
</style>
