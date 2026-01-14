<template>
  <div class="dashboard-container">
    <div class="hamburger-menu" @click="toggleSidebar" :class="{ active: isSidebarOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="dashboard-layout">
      <aside class="sidebar" :class="{ open: isSidebarOpen }">
        <nav>
          <ul>
            <li @click="selectSection('dashboard')" :class="{ active: activeSection === 'dashboard' }">Tableau de bord</li>
            <li @click="selectSection('offices')" :class="{ active: activeSection === 'offices' }">Bureaux</li>
            <li @click="selectSection('users')" :class="{ active: activeSection === 'users' }">Utilisatrices</li>
            <li @click="selectSection('contacts')" :class="{ active: activeSection === 'contacts' }">Contacts</li>
            <li @click="selectSection('events')" :class="{ active: activeSection === 'events' }">Événements</li>
            <li @click="selectSection('joins')" :class="{ active: activeSection === 'joins' }">Rejointe</li>
            <li @click="selectSection('pvs')" :class="{ active: activeSection === 'pvs' }">Pvs</li>
          </ul>
        </nav>
      </aside>

      <main class="content">
        <div v-if="activeSection === 'dashboard'" class="dashboard-container2">
          <h2 class="text-2xl font-bold mb-8">Tableau de bord</h2>

          <div class="dashboard-grid">
            <!-- Contact Analysis -->
            <div class="dashboard-card">
              <h3 class="text-xl font-semibold mb-4">Analyse des contacts</h3>
              <div class="chart-container">
                <BarChart :chartData="contactChartData" />
              </div>
            </div>

            <!-- Event Analysis -->
            <div class="dashboard-card">
              <h3 class="text-xl font-semibold mb-4">Analyse des événements</h3>
              <div class="chart-container">
                <BarChart :chartData="eventChartData" />
              </div>
              <div class="mt-4 border-t pt-4">
                <h4 class="font-semibold mb-2">Bureaux avec le plus d'événements</h4>
                <div class="chart-container">
                  <LineChart :chartData="topOfficesEventsChartData" />
                </div>
                <div class="mt-2 flex flex-wrap gap-2 justify-end">
                  <div v-for="office in allAnalysis?.data?.eventAnalysis.topOfficesWithMostEvents" :key="office._id">
                    <router-link
                      :to="`/office/${office._id}`"
                      class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm inline-block"
                    >
                    <button>Voir le bureau</button>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Join Analysis -->
            <div class="dashboard-card">
              <h3 class="text-xl font-semibold mb-4">Analyse des adhésions</h3>
              <h4>chaque bureau dispose d'un formulaire d'adhésion qui peut être rempli par les étudiants de l'ensi, ce tableau représente l'analyse des soumissions de ces formulaires</h4>
              <div class="chart-container">
                <BarChart :chartData="joinChartData" />
              </div>
              <div class="mt-4 border-t pt-4">
                <h4 class="font-semibold mb-2">Bureaux avec le plus de demandes d'adhésions</h4>
                <div class="chart-container">
                  <LineChart :chartData="topOfficesJoinChartData" />
                </div>
                <div class="mt-2 flex flex-wrap gap-2 justify-end">
                  <div v-for="office in allAnalysis?.data?.joinAnalysis.topOfficesWithJoinRequests" :key="office._id">
                    <router-link
                      :to="`/office/${office._id}`"
                      class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm inline-block"
                    >
                      <button>Voir le bureau</button>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Office Analysis -->
            <div class="dashboard-card">
              <h3 class="text-xl font-semibold mb-4">Analyse des bureaux</h3>
              <div class="chart-container">
                <PieChart :chartData="officeChartData" />
              </div>
              <div class="mt-4 border-t pt-4">
                <h4 class="font-semibold mb-2">Bureaux avec le plus nombre de membres</h4>
                <div class="chart-container">
                  <LineChart :chartData="officesMembersChartData" />
                </div>
                <div class="mt-2 flex flex-wrap gap-2 justify-end">
                  <div v-for="office in allAnalysis?.data?.officeAnalysis.officesWithMostMembers" :key="office._id">
                    <router-link
                      :to="`/office/${office._id}`"
                      class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm inline-block"
                    >
                      <button>Voir le bureau</button>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Analysis -->
            <div class="dashboard-card">
              <h3 class="text-xl font-semibold mb-4">Analyse des utilisateurs</h3>
              <h4>Le graphique représente les utilisateurs dont les comptes sont activés et non activés.</h4>
              <div class="chart-container">
                <BarChart :chartData="userChartData" />
              </div>
              <div class="mt-4 border-t pt-4">
                <h4 class="font-semibold mb-2">Utilisateurs les plus actifs</h4>
                <h5>Le graphique représente les Top utilisateurs ayant rejoint un bureau. Les nombres indiquent le nombre de bureaux auxquels ils ont adhéré.</h5>
                <div class="chart-container">
                  <LineChart :chartData="activeUsersChartData" />
                </div>
              </div>
              <div class="mt-4 border-t pt-4">
                <h4 class="font-semibold mb-2">Utilisateurs par rôle</h4>
                <h5>Le graphique représente le nombre d'utilisateurs dans les rôles d'étudiant (Rôle 1) et d'administrateur (Rôle 0).</h5>
                <div class="chart-container">
                  <LineChart :chartData="usersByRoleChartData" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeSection === 'offices'">
          <div class="offices-container">
            <div class="header">
              <h2>Gestion des bureaux</h2>
            </div>

            <div class="filter-toggle-btn">
              <div class="icon-container">
                <img src="/pictures/filter.png" alt="Toggle filters" class="icon" @click="toggleFilters" />
                <div class="displayText">filter</div>
              </div>

              <div v-if="showFilters" class="filter-section">
                <label>Recherche:</label>
                <input v-model="officeFilters.search" placeholder="Rechercher par nom, email ou slogan"><br>

                <label>Statut:</label>
                <select v-model="officeFilters.status">
                  <option value="">Tout</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div class="offices-list">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th>Nom</th>
                    <th>Slogan</th>
                    <th>E-mail</th>
                    <th></th>
                    <th>Président(e)</th>
                    <th>Actions</th>
                    <th>Statut</th>
                    <th>Archive</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="office in filterOffices()" :key="office._id">
                    <td> <img :src="office.picture || defaultPicture" alt="office"> </td>
                    <td>{{ office.abb }}</td>
                    <td>{{ office.name }}</td>
                    <td>{{ office.slogan }}</td>
                    <td>{{ office.email }}</td>
                    <td>
                      <img :src="office.president?.picture || defaultPicture" alt="office">
                    </td>
                    <td>
                      <span v-if="office.president && office.president.firstName && office.president.lastName">
                        {{ office.president.firstName }} {{ office.president.lastName }}
                      </span>
                      <span v-else>L'utilisateur n'existe plus</span>
                    </td>
                    <td>
                      <span :class="['status-badge', office.status ? 'active' : 'inactive']">
                        {{ office.status ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>
                      <span :class="['status-badge', office.archive ? 'inactive' : 'active']">
                        {{ office.archive ? 'Archived' : 'Unarchived' }}
                      </span>
                    </td>
                    <td>
                      <router-link :to="`/office/${office._id}`" v-if="office.status === true" class="icon-container">
                        <img src="/pictures/more.png" alt="voir plus" class="icon">
                        <div class="displayText">voir plus</div>
                      </router-link>
                      <div class="icon-container">
                        <img v-if="office.status === false" @click="approveOffice(office._id)" src="/pictures/approve.png" alt="approuver" class="icon" >
                        <div class="displayText">approuver</div>
                      </div>
                      <div class="icon-container">
                        <img v-if="office.status === false" @click="declineOffice(office._id)"  src="/pictures/X.png" alt="désapprouver" class="icon">
                        <div class="displayText">désapprouver</div>
                      </div>
                      <div class="icon-container">
                        <img v-if="office.status === true && !office.archive" @click="archiveOffice(office)" src="/pictures/archive.png" alt="archive" class="icon">
                        <div class="displayText">archive</div>
                      </div>
                      <div class="icon-container">
                        <img v-if="office.status === true && office.archive" @click="archiveOffice(office)" src="/pictures/unarchive.png" alt="désarchiver" class="icon">
                        <div class="displayText">désarchiver</div>
                      </div>
                      <div class="icon-container">
                        <img v-if="office.status === true && !office.archive" @click="showProfileModal(office._id)" src="/pictures/edit.png" alt="Modifier" class="icon">
                        <div class="displayText">Modifier</div>
                      </div>
                      <div class="icon-container">
                        <img v-if="office.status === true" src="/pictures/password.png" @click="showPasswordModal(office._id)" alt="mot de passe" class="icon">
                        <div class="displayText">mettre à jour le mot de passe</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="isPasswordModalOpen" class="modal-overlay" @click="closePasswordModal">
              <div class="modal" @click.stop>
                <div class="modal-header">
                  <h3>Mettre à jour le mot de passe</h3>
                  <button class="close-button" @click="closePasswordModal">&times;</button>
                </div>
                <div class="modal-content">
                  <form @submit.prevent="updatePassword">
                    <div class="form-group">
                      <label for="newPassword">Nouveau mot de passe</label>
                      <div class="password-input-container">
                        <input v-model="newPassword" :type="passwordVisible ? 'text' : 'password'" id="newPassword"
                          required>
                        <i class="fa" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'" @click="togglePasswordVisibility"></i>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="confirmPassword">Confirmez le mot de passe</label>
                      <div class="password-input-container">
                        <input v-model="confirmPassword" :type="passwordVisible ? 'text' : 'password'"
                          id="confirmPassword" required>
                        <i class="fa" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'" @click="togglePasswordVisibility"></i>
                      </div>
                    </div>
                    <div class="form-buttons">
                      <button type="button" class="cancel-button" @click="closePasswordModal">Annuler</button>
                      <button type="submit" class="submit-button">Mettre à jour le mot de passe</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div v-if="isProfileModalOpen" class="modal-overlay" @click="closeProfileModal">
              <div class="modal" @click.stop>
                <div class="modal-header">
                  <h3>Mettre à jour le profil</h3>
                  <button class="close-button" @click="closeProfileModal">&times;</button>
                </div>
                <div class="modal-content">
                  <form @submit.prevent="updateProfile">
                    <div class="form-group">
                      <label for="name">Nom</label>
                      <input v-model="updatedOffice.name" type="text" id="name" required>
                    </div>
                    <div class="form-group">
                      <label for="email">E-mail</label>
                      <input v-model="updatedOffice.email" type="email" id="email" required>
                    </div>
                    <div class="form-group">
                      <label for="abb">Abréviation</label>
                      <input v-model="updatedOffice.abb" type="text" id="abb" required>
                    </div>
                    <div class="form-group">
                      <label for="slogan">Slogan</label>
                      <input v-model="updatedOffice.slogan" type="text" id="slogan" required>
                    </div>
                    <div class="form-group">
                      <label for="description">Description</label>
                      <textarea v-model="updatedOffice.description" id="description" required></textarea>
                    </div>

                    <div class="form-group">
                      <label for="president">Président(e)</label>
                      <select v-model="updatedOffice.president" id="president" required>
                        <option v-for="user in users" :key="user._id" :value="user._id">
                          {{ user.firstName }} {{ user.lastName }}
                        </option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label for="vice">vice-président(e)</label>
                      <select v-model="updatedOffice.vice" id="vice" required>
                        <option v-for="user in users" :key="user._id" :value="user._id">
                          {{ user.firstName }} {{ user.lastName }}
                        </option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label for="secretary">Secrétaire</label>
                      <select v-model="updatedOffice.secretary" id="secretary" required>
                        <option v-for="user in users" :key="user._id" :value="user._id">
                          {{ user.firstName }} {{ user.lastName }}
                        </option>
                      </select>
                    </div>

                    <div class="form-buttons">
                      <button type="button" class="cancel-button" @click="closeProfileModal">Annuler</button>
                      <button type="submit" class="submit-button">Mettre à jour le profil</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <p v-if="filterOffices().length === 0" class="no-event-message">Pas de bureau</p>
          </div>
        </div>
        <div v-if="activeSection === 'users'">
          <div class="users-container">
            <div class="header">
              <h2>Gestion des utilisateurs</h2>
              <div class="icon-container">
                <img src="/pictures/add.png" alt="Ajouter un utilisateur" class="icon" @click="openModal" />
                <div class="displayText">Ajouter un utilisateur</div>
              </div>
            </div>
            <div class="filter-toggle-btn">

              <div class="icon-container">
                <img src="/pictures/filter.png" alt="Toggle filters" class="icon" @click="toggleFilters" />
                <div class="displayText">filter</div>
              </div>

              <div v-if="showFilters" class="filter-section">
                <label>Recherche:</label>
                <input v-model="filters.search" placeholder="Rechercher par nom d'utilisateur, prénom, nom ou e-mail"><br>

                <label>Rôle:</label>
                <select v-model="filters.role">
                  <option value="">Tout</option>
                  <option value="0">Admin</option>
                  <option value="1">Utilisateur</option>
                </select>

                <label>Statut:</label>
                <select v-model="filters.status">
                  <option value="">Tout</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>

                <label>Secteur:</label>
                <select v-model="filters.sector">
                  <option value="">Tout</option>
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

                <label>Niveau:</label>
                <select v-model="filters.level">
                  <option value="">Tout</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <div class="users-list">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Nom d'utilisateur</th>
                    <th>E-mail</th>
                    <th>Rôle</th>
                    <th>Téléphone</th>
                    <th>Filière</th>
                    <th>Niveau</th>
                    <th>Statut</th>
                    <th>Date de création</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in filterUsers()" :key="user._id">
                    <td> <img :src="user.picture || defaultPicture" alt="user"> </td>
                    <td>{{ user.firstName }} {{ user.lastName }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ getRôleName(user.role) }}</td>
                    <td>{{ user.tel }}</td>
                    <td>{{ user.sector }}</td>
                    <td>{{ user.level === '' ? '' : (user.level === 1 ? 'ere' : user.level + 'eme') }}</td>
                    <td>
                      <span :class="['status-badge', user.status ? 'active' : 'inactive']">
                        {{ user.status ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>{{ user.dateCreated }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="filterUsers().length === 0" class="no-event-message">No User</p>
            <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
              <div class="modal" @click.stop>
                <div class="modal-header">
                  <h3>Ajouter un nouvel utilisateur</h3>
                  <h5>Mot de passe par défaut : ensi2025</h5>
                  <button class="close-button" @click="closeModal">&times;</button>
                </div>
                <div class="modal-content">
                  <form @submit.prevent="submitAddUser">
                    <div class="form-group">
                      <label>Prénom</label>
                      <input v-model="newUser.firstName" type="text" required>
                    </div>
                    <div class="form-group">
                      <label>Nom de famille</label>
                      <input v-model="newUser.lastName" type="text" required>
                    </div>
                    <div class="form-group">
                      <label>Nom d'utilisateur</label>
                      <input v-model="newUser.username" type="text" required>
                    </div>
                    <div class="form-group">
                      <label>E-mail</label>
                      <input v-model="newUser.email" type="email" required>
                    </div>
                    <div class="form-group">
                      <label>Téléphone</label>
                      <input v-model="newUser.tel" type="tel" maxlength="10" pattern="0[0-9]{9}" required>
                    </div>
                    <div class="form-group">
                      <label>Filière</label>
                      <select v-model="newUser.sector" required>
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
                    <div class="form-group">
                      <label>Niveau</label>
                      <input type="number" v-model="newUser.level" min="1" max="5" placeholder="Niveau" required />
                    </div>
                    <div class="form-group">
                      <label>Date de naissance</label>
                      <input v-model="newUser.birthDate" max="2009-12-31" type="date" required>
                    </div>
                    <div class="form-group">
                      <label>Rôle</label>
                      <select v-model="newUser.role">
                        <option value="1">User</option>
                        <option value="0">Admin</option>
                      </select>
                    </div>
                    <div class="form-buttons">
                      <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
                      <button type="button" :disabled="isLoading" class="cancel-button"
                        @click="closeModal">Annuler</button>
                      <button type="submit" class="submit-button">Ajouter un utilisateur</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeSection === 'contacts'">
          <h2>List des contacts</h2>
          <h4>Il s'agit d'une liste de messages de contacts envoyés par des personnes essayant de vous contacter pour certaines informations ou autres</h4>
          <div class="filter-toggle-btn">

            <div class="icon-container">
              <img src="/pictures/filter.png" alt="Toggle filters" class="icon" @click="toggleFilters" />
              <div class="displayText">filter</div>
            </div>

            <div v-if="showFilters" class="filter-section">
              <label>Trier par:</label>
              <select v-model="contactFilters.sortBy">
                <option value="A-Z">A-Z</option>
                <option value="newest">Le plus récent</option>
                <option value="oldest">Le plus ancien</option>
              </select>

              <label>Statut:</label>
              <select v-model="contactFilters.status">
                <option value="">Tout</option>
                <option value="true">Fait</option>
                <option value="false">En attente</option>
              </select>
            </div>
          </div>

          <div class="contacts-list">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>E-mail</th>
                  <th>Message</th>
                  <th>Statut</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="contact in filterContacts()" :key="contact._id">
                  <td>{{ contact.name }}</td>
                  <td>{{ contact.email }}</td>
                  <td>{{ contact.message }}</td>
                  <td>
                    <span :class="['status-badge', contact.status ? 'done' : 'undone']">
                      {{ contact.status ? 'Fait' : 'Attendant' }}
                    </span>
                  </td>
                  <td>{{ contact.dateCreated }}</td>
                  <td>

                    <div class="icon-container">
                      <img v-if="!contact.status" src="/pictures/done.png" alt="faite" class="icon" @click="markAsDone(contact)" />
                      <div class="displayText">faite</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="activeSection === 'joins'">
          <h2>Liste d'inscription</h2>
          <h4>Il s'agit d'une liste d'étudiants qui ont demandé à rejoindre différents bureaux via notre site Web</h4>
          <div class="filter-toggle-btn">

            <div class="icon-container">
              <img src="/pictures/filter.png" alt="Toggle filters" class="icon" @click="toggleFilters" />
              <div class="displayText">filter</div>
            </div>

            <div v-if="showFilters" class="filter-section">
              <label>Filtrer par bureau:</label>
              <select v-model="joinFilters.office">
                <option value="">Tous les bureaux</option>
                <option v-for="office in offices" :key="office._id" :value="office._id">{{ office.name }}</option>
              </select>

              <label>Filtrer par statut:</label>
              <select v-model="joinFilters.status">
                <option value="">Tout</option>
                <option value="true">Accepté</option>
                <option value="false">En attente</option>
              </select>
            </div>
          </div>

          <div class="joins-list">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>E-mail</th>
                  <th>Bureau</th>
                  <th>Pôle</th>
                  <th>Statut</th>
                  <th>Date de création</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="join in filterJoins()" :key="join._id">
                  <td>{{ join.name }}</td>
                  <td>{{ join.email }}</td>
                  <td>
                    {{ join.office?.abb || '' }} | {{ join.office?.name || '' }}
                  </td>
                  <td>{{ join.pole }}</td>
                  <td>
                    <span :class="['status-badge', join.status ? 'accepted' : 'pending']">
                      {{ join.status ? 'Accepted' : 'Pending' }}
                    </span>
                  </td>
                  <td>{{ join.dateCreated }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="activeSection === 'events'">
          <h2>Événements</h2>
          <h4>Ici sont affichés tous les événements créés par tous les bureaux, vous pouvez approuver leurs activités en cliquant sur le bouton approuver pour rendre leur activité officielle et accessible à tous les utilisateurs</h4>
          <div class="filter-toggle-btn">

            <div class="icon-container">
              <img src="/pictures/filter.png" alt="Toggle filters" class="icon" @click="toggleFilters" />
              <div class="displayText">filter</div>
            </div>

            <div v-if="showFilters" class="filter-section">
              <label>Filtrer par archive:</label>
              <select v-model="eventFilters.archive">
                <option value="">Tout</option>
                <option value="true">Archivé</option>
                <option value="false">Non archivé</option>
              </select>

              <label>Filtrer par statut:</label>
              <select v-model="eventFilters.active">
                <option value="">Tout</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <label>Filtrer par bureau:</label>
              <select v-model="eventFilters.office">
                <option value="">Tous les bureaux</option>
                <option v-for="office in offices" :key="office._id" :value="office._id">{{ office.name }}</option>
              </select>
            </div>
          </div>

          <div v-if="inactiveEventCount > 0" class="notification">
            {{ inactiveEventCount }} les événements sont actuellement inactifs!
          </div>

          <div class="events-list">
            <div v-for="event in filteredEvents()" :key="event._id" class="event-card">
              <div class="card-header">
                <h3>{{ event.name }}</h3>
                <p class="office-info">{{ event.office.abb }} | {{ event.office.name }}</p>
                <div v-if="event.note && event.active === false" class="note-bubble" @click="toggleNote">
                  <span class="note-preview">{{ truncatedNote(event.note) }}</span>
                  <div v-if="isNoteExpanded" class="note-full">
                    {{ event.note }}
                  </div>
                </div>
                <div class="action-buttons">
                  <div class="icon-container">
                    <img v-if="event.active === false" @click="approveEvent(event._id)" src="/pictures/approve.png" alt="Approuver" class="icon" />
                    <div class="displayText">approuver</div>
                  </div>
                  <div class="icon-container">
                    <img v-if="event.active === false" @click="openNoteModal(event._id)" src="/pictures/edit.png" alt="Ajouter une note" class="icon" />
                    <div class="displayText">Ajouter une note</div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <p class="event-description">{{ event.description }}</p>
                <div class="event-details">
                  <p><strong>Lieu:</strong> {{ event.location }}</p>
                  <p><strong>Date:</strong> {{ event.startDate }} - {{ event.endDate }}</p>
                  <p><strong>Statut:</strong> <span :class="event.active ? 'active' : 'inactive'">{{ event.active ? 'Active' : 'Inactive' }}</span></p>
                  <p><strong>Archivé:</strong> {{ event.archive ? 'Oui' : 'Non' }}</p>
                </div>

                <div v-if="event.collaborators.length > 0" class="collaborators-section">
                  <h4>Collaborateurs:</h4>
                  <ul>
                    <li v-for="(collaborator, index) in event.collaborators" :key="index">{{ collaborator }}</li>
                  </ul>
                </div>

                <div v-if="event.activities.length > 0" class="activities-section">
                  <h4>Activités:</h4>
                  <ul>
                    <li v-for="(activity, index) in event.activities" :key="index">{{ activity }}</li>
                  </ul>
                </div>

                <div v-if="event.posters.length > 0" class="image-carousel">
                  <button @click="prev(event)" class="carousel-button">&#10094;</button>
                  <div class="image-container">
                    <img :src="event.posters[currentIndices[event._id] || 0]" alt="Event Poster" class="poster-image" />
                  </div>
                  <button @click="next(event)" class="carousel-button">&#10095;</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isNoteModalOpen" class="modal-overlay" @click="closeNoteModal">
            <div class="modal" @click.stop>
              <div class="modal-header">
                <h3>Ajouter une note</h3>
                <button class="close-button" @click="closeNoteModal">&times;</button>
              </div>
              <div class="modal-content">
                <form @submit.prevent="submitNote(selectedEventId)">
                  <div class="form-group">
                    <label>Remarque</label>
                    <textarea v-model="noteMessage" placeholder="Entrez votre note ici..." required></textarea>
                  </div>
                  <div class="form-buttons">
                    <button type="button" class="cancel-button" @click="closeNoteModal">Annuler</button>
                    <button type="submit" class="submit-button">Soumettre la note</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeSection === 'pvs'">
          <div class="offices-container">
            <div class="header">
              <h2>Gestion des Pvs</h2>
              <div class="icon-container">
                <img src="/pictures/add.png" alt="Ajouter un pv" class="icon" @click="openAddPvModal" />
                <div class="displayText">Ajouter un pv</div>
              </div>
            </div>

            <div class="filter-toggle-btn">
              <div class="icon-container">
                <img src="/pictures/filter.png" alt="Toggle filters" class="icon" @click="toggleFilters" />
                <div class="displayText">filter</div>
              </div>

              <div v-if="showFilters" class="filter-section">
                <label>Recherche:</label>
                <input v-model="pvsFilters.search" placeholder="Rechercher par nom, email ou slogan"><br>

                <label>Statut:</label>
                <select v-model="pvsFilters.sortBy">
                <option value="A-Z">A-Z</option>
                <option value="newest">Le plus récent</option>
                <option value="oldest">Le plus ancien</option>
                </select>
              </div>
            </div>

            <div class="offices-list">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>description</th>
                    <th></th>
                    <th>Utilisateur</th>
                    <th>Date Creer</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pv in filterPvs()" :key="pv._id">
                    <td>{{ pv.name }}</td>
                    <td>{{ pv.description }}</td>
                    <td> <img :src="pv.user.picture || defaultPicture" alt="user"> </td>
                    <td>{{ pv.user.firstName }} {{ pv.user.lastName }}</td>
                    <td>{{ pv.dateCreated }}</td>
                    <td>
                      <div class="icon-container">
                        <img @click="openEditPvModal(pv)" src="/pictures/edit.png" alt="Modifier" class="icon" />
                        <div class="displayText">Modifier</div>
                      </div>
                      <button class="delete-button" @click="deletePvFunction(pv)">X</button>
                      <a :href="getPdfPreviewUrl(pv)" class="download-button" download>Télécharger</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="isPvModalOpen" class="modal-overlay" @click="closePvModal">
              <div class="modal" @click.stop>
                <div class="modal-header">
                  <h3>{{ isEditing ? 'Modifier le PV' : 'Ajouter un nouvel PV' }}</h3>
                  <button class="close-button" @click="closePvModal">&times;</button>
                </div>
                <div class="modal-content">
                  <form @submit.prevent="submitPv">
                    <div class="form-group">
                      <label>Nom</label>
                      <input v-model="newPv.name" type="text" required>
                    </div>
                    <div class="form-group">
                      <label>Description</label>
                      <input v-model="newPv.description" type="text" required>
                    </div>
                    <div class="form-group">
                      <label>Sélectionner l'utilisateur</label>
                      <input
                        type="text"
                        v-model="searchQuery"
                        :placeholder="newPv.user ? getUserName(newPv.user) : 'Rechercher un utilisateur...'"
                      />
                      <select v-model="newPv.user" @change="searchQuery = getUserName(newPv.user)" size="5">
                        <option v-for="user in filteredUsers" :key="user._id" :value="user._id">
                          {{ user.firstName }} {{ user.lastName }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Fichier (.PDF)</label>
                      <input type="file" @change="handleFileUpload" accept=".pdf">
                    </div>
                    <div v-if="pdfPreviewUrl">
                      <h3>Aperçu</h3>
                      <iframe :src="pdfPreviewUrl" width="100%" height="500px"></iframe>
                    </div>
                    <div class="form-buttons">
                      <Spinner :isLoading="isLoading" message="Traitement en cours..." />
                      <button type="button" :disabled="isLoading" class="cancel-button" @click="closePvModal">
                        Annuler
                      </button>
                      <button type="submit" class="submit-button">
                        {{ isEditing ? 'Modifier' : 'Ajouter' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <p v-if="filterPvs().length === 0" class="no-event-message">Aucun rapport n'a encore été enregistré. Publiez votre nouveau rapport maintenant!</p>
          </div>
        </div>
      </main>
    </div>

    <div class="overlay" :class="{ active: isSidebarOpen }" @click="closeSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';
import type { ChartData } from 'chart.js'

import BarChart from '@/components/BarChart.vue'
import { confirm } from '@/components/confirm';
import LineChart from '@/components/LineChart.vue'
import PieChart from '@/components/PieChart.vue'
import Spinner from '@/components/Spinner/spinner.vue';

import { analysis } from "@/services/Admin";
import { allContacts, updateContact } from "@/services/ContactApi";
import { allEvents, updateEvent } from '@/services/EventApi';
import { allJoins} from '@/services/JoinApi';
import { resetOfficePassword, updateOffice, allOffices, deleteOffice } from '@/services/OfficeApi';
import { uploadPvAdmin } from '@/services/PictureApi';
import { allPvs, addPv, deletePv, updatePv } from '@/services/PvApi';
import { allUsers, addUser } from '@/services/UserApi';
import { computed } from "@vue/reactivity";

const isSidebarOpen = ref(false);
const isLoading = ref(false);
const activeSection = ref("dashboard");
const isModalOpen = ref(false);
const defaultPicture = new URL('/pictures/profile.png', import.meta.url).href;
const isPasswordModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const currentOfficeId = ref('');
const passwordVisible = ref(false);
const inactiveEventCount = ref(0);
const currentIndices = ref({});
const isNoteModalOpen = ref(false);
const noteMessage = ref("");
const selectedEventId = ref("");
const isNoteExpanded = ref(false);
const showFilters = ref(false);
const isPvModalOpen = ref(false);
const isEditing = ref(false);
const executiveUser = ref(null);
const pdfPreviewUrl = ref('');
const searchQuery = ref("");

interface AnalysisData {
  contactAnalysis: {
    totalContacts: number
    activeContacts: number
    inactiveContacts: number
  }
  eventAnalysis: {
    totalEvents: number
    activeEvents: number
    archivedEvents: number
    eventsWithUpdates: number
    topOfficesWithMostEvents: Array<{
      _id: string
      count: number
      officeName: string
    }>
  }
  joinAnalysis: {
    totalJoins: number
    acceptedJoins: number
    pendingJoins: number
    topOfficesWithJoinRequests: Array<{
      _id: string
      count: number
      officeName: string
    }>
  }
  officeAnalysis: {
    totalOffices: number
    activeOffices: number
    archivedOffices: number
    officesWithMostMembers: Array<{
      _id: string
      name: string
      memberCount: number
    }>
  }
  userAnalysis: {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    usersByRole: Array<{
      _id: string
      count: number
    }>
    mostActiveUsers: Array<{
      _id: string
      count: number
      userName: string
    }>
  }
};
const allAnalysis = ref<AnalysisData | null>(null);
const contactChartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: []
});
const eventChartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: []
});
const joinChartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: []
});
const officeChartData = ref<ChartData<'pie'>>({
  labels: [],
  datasets: []
});
const userChartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: []
});
const activeUsersChartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: []
});
const usersByRoleChartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: []
});
const topOfficesEventsChartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: []
});
const topOfficesJoinChartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: []
});
const officesMembersChartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: []
});

onMounted(async () => {
  const analysisData = await analysis();
  allAnalysis.value = analysisData;

  contactChartData.value = {
    labels: ['Total Contacts', 'Active Contacts', 'Inactive Contacts'],
    datasets: [
      {
        label: 'Contacts',
        backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
        data: [
          allAnalysis.value.data.contactAnalysis.totalContacts,
          allAnalysis.value.data.contactAnalysis.activeContacts,
          allAnalysis.value.data.contactAnalysis.inactiveContacts
        ]
      }
    ]
  }

  eventChartData.value = {
    labels: ['Total Events', 'Active Events', 'Archived Events', 'Events with Updates'],
    datasets: [
      {
        label: 'Events',
        backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384', '#FFCE56'],
        data: [
          allAnalysis.value.data.eventAnalysis.totalEvents,
          allAnalysis.value.data.eventAnalysis.activeEvents,
          allAnalysis.value.data.eventAnalysis.archivedEvents,
          allAnalysis.value.data.eventAnalysis.eventsWithUpdates
        ]
      }
    ]
  }

  joinChartData.value = {
    labels: ['Total Joins', 'Accepted Joins', 'Pending Joins'],
    datasets: [
      {
        label: 'Joins',
        backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
        data: [
          allAnalysis.value.data.joinAnalysis.totalJoins,
          allAnalysis.value.data.joinAnalysis.acceptedJoins,
          allAnalysis.value.data.joinAnalysis.pendingJoins
        ]
      }
    ]
  }

  officeChartData.value = {
    labels: ['Active Offices', 'Archived Offices'],
    datasets: [
      {
        backgroundColor: ['#36A2EB', '#FF6384'],
        data: [
          allAnalysis.value.data.officeAnalysis.activeOffices,
          allAnalysis.value.data.officeAnalysis.archivedOffices
        ]
      }
    ]
  }

  userChartData.value = {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [
      {
        label: 'Users',
        backgroundColor: ['#36A2EB', '#FF6384'],
        data: [
          allAnalysis.value.data.userAnalysis.activeUsers,
          allAnalysis.value.data.userAnalysis.inactiveUsers
        ]
      }
    ]
  }

  activeUsersChartData.value = {
    labels: allAnalysis.value.data.userAnalysis.mostActiveUsers.map(user => user.userName),
    datasets: [{
      label: 'Activités par utilisateur',
      borderColor: '#36A2EB',
      tension: 0.1,
      data: allAnalysis.value.data.userAnalysis.mostActiveUsers.map(user => user.count)
    }]
  }

  usersByRoleChartData.value = {
    labels: allAnalysis.value.data.userAnalysis.usersByRole.map(role => `Rôle ${role._id}`),
    datasets: [{
      label: 'Utilisateurs par rôle',
      borderColor: '#4BC0C0',
      tension: 0.1,
      data: allAnalysis.value.data.userAnalysis.usersByRole.map(role => role.count)
    }]
  }

  topOfficesEventsChartData.value = {
    labels: allAnalysis.value.data.eventAnalysis.topOfficesWithMostEvents.map(office => office.officeName),
    datasets: [{
      label: 'Événements par bureau',
      borderColor: '#FF6384',
      tension: 0.1,
      data: allAnalysis.value.data.eventAnalysis.topOfficesWithMostEvents.map(office => office.count)
    }]
  }

  topOfficesJoinChartData.value = {
    labels: allAnalysis.value.data.joinAnalysis.topOfficesWithJoinRequests.map(office => office.officeName),
    datasets: [{
      label: 'Demandes par bureau',
      borderColor: '#FFCE56',
      tension: 0.1,
      data: allAnalysis.value.data.joinAnalysis.topOfficesWithJoinRequests.map(office => office.count)
    }]
  }

  officesMembersChartData.value = {
    labels: allAnalysis.value.data.officeAnalysis.officesWithMostMembers.map(office => office.name),
    datasets: [{
      label: 'Membres par bureau',
      borderColor: '#36A2EB',
      tension: 0.1,
      data: allAnalysis.value.data.officeAnalysis.officesWithMostMembers.map(office => office.memberCount)
    }]
  }
})

const updatedOffice = ref({
  name: '',
  email: '',
  abb: '',
  slogan: '',
  description: '',
  president: '',
  vice: '',
  secretary: ''
});

const users = ref([
  {
    _id: "",
    role: "",
    picture: null,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    birthDate: "",
    tel: "",
    level: "",
    sector: "",
    status: true,
    dateCreated: ""
  }
]);

const newUser = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  tel: '',
  password: 'ensi2025',
  level: "",
  sector: "",
  birthDate: '',
  role: '1'
});

const filters = ref({
  role: '',
  status: '',
  sector: '',
  level: '',
  search: ''
});

onMounted(async () => {
  const userData = await allUsers();
  if (userData && userData.data) {
    const updatedUsers = userData.data.map(user => {
      if (user.picture) {
        const pictureName = user.picture.split('/').pop();
        user.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${user._id}/${pictureName}`;
      }
      user.dateCreated = new Date(user.dateCreated).toISOString().replace('T', ' ').slice(0, 16);
      return user;
    });
    users.value = updatedUsers;
  }
});

const openModal = () => {
  isModalOpen.value = true;
};

const filterUsers = () => {
  return users.value.filter(user => {
    const roleMatch = filters.value.role ? user.role == filters.value.role : true;
    const statusMatch = filters.value.status === '' || filters.value.status === undefined
      ? true : user.status == (filters.value.status === 'true');
    const sectorMatch = filters.value.sector ? user.sector.includes(filters.value.sector) : true;
    if(sectorMatch){
    }
    const levelMatch = filters.value.level ? user.level == filters.value.level : true;
    const searchMatch = filters.value.search
      ? user.username.includes(filters.value.search) ||
      user.firstName.includes(filters.value.search) ||
      user.lastName.includes(filters.value.search) ||
      user.email.includes(filters.value.search)
      : true;

    return roleMatch && statusMatch && sectorMatch && levelMatch && searchMatch;
  });
};

const closeModal = () => {
  isModalOpen.value = false;
  searchQuery.value = "";
  pdfPreviewUrl.value = "";
  executiveUser.value = null;
  newUser.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    tel: '',
    birthDate: '',
    role: '1'
  };
};

const submitAddUser = async () => {
  isLoading.value = true;
  const plainUser = {
    firstName: newUser.value.firstName,
    lastName: newUser.value.lastName,
    username: newUser.value.username,
    email: newUser.value.email,
    tel: newUser.value.tel,
    password: newUser.value.password,
    level: newUser.value.level,
    sector: newUser.value.sector,
    birthDate: newUser.value.birthDate,
    role: newUser.value.role,
  };

  try {
    await addUser(plainUser);
    toast.success("Utilisateur ajouté avec succès!", { autoClose: 3000, });
    closeModal();
    window.location.reload();
  } catch (error) {
    toast.error("Erreur lors de l'ajout d'un utilisateur", { autoClose: 3000, });
    console.error(error.response?.data?.message);
  } finally {
    isLoading.value = false;
  }
};

// pvs

const pvs = ref([]);

const pvsFilters = ref({
  sortBy: "A-Z",
  search: ""
});

onMounted(async () => {
  const pvData = await allPvs();
  if (pvData && pvData.data) {
    const updatedPv = pvData.data.map(pv => {
      if (pv.user.picture) {
        const pictureName = pv.user.picture.split('/').pop();
        pv.user.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${pv.user._id}/${pictureName}`;
      }
      pv.dateCreated = new Date(pv.dateCreated).toISOString().replace('T', ' ').slice(0, 16);
      return pv;
    });
    pvs.value = updatedPv;
  }
});

const filterPvs = () => {
  return pvs.value.filter((pv) => {
    const searchMatch = pvsFilters.value.search
      ? pv.name.toLowerCase().includes(pvsFilters.value.search.toLowerCase()) ||
      pv.description.toLowerCase().includes(pvsFilters.value.search.toLowerCase()) ||
      pv.user.firstName.toLowerCase().includes(pvsFilters.value.search.toLowerCase()) ||
      pv.user.lastName.toLowerCase().includes(pvsFilters.value.search.toLowerCase()) ||
      pv.user.username.toLowerCase().includes(pvsFilters.value.search.toLowerCase()) ||
      pv.user.email.toLowerCase().includes(pvsFilters.value.search.toLowerCase())
      : true;

    let filteredPvs = pvs.value;

    switch (pvsFilters.value.sortBy) {
      case "A-Z":
      filteredPvs = filteredPvs.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      filteredPvs = filteredPvs.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
        break;
      case "newest":
      filteredPvs = filteredPvs.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
        break;
    }
    return searchMatch && filteredPvs;
  });
};

const getPdfPreviewUrl = (pv) => {
  const pvName = pv.pv.split('/').pop();
  return `${import.meta.env.VITE_API_URL}/api/picture/pv/${pv.user._id}/${pvName}`;
};

const openAddPvModal = () => {
  isEditing.value = false;
  newPv.value = { name: "", description: "", user: "", pv: "" };
  isPvModalOpen.value = true;
};

const openEditPvModal = (pv) => {
  isEditing.value = true;
  newPv.value = { ...pv };
  newPv.value.user = pv.user._id;
  isPvModalOpen.value = true;
};

const newPv = ref({
  _id: 0,
  name: '',
  description: '',
  user: '',
  pv: ''
});

const closePvModal = () => {
  isPvModalOpen.value = false;
  executiveUser.value = null;
  pdfPreviewUrl.value = '';
  searchQuery.value = '';
  newUser.value = {
    name: '',
    description: '',
    user: '',
    pv: ''
  };
};

const submitPv = async () => {
  try {
    isLoading.value = true;

    if (isEditing.value) {

      console.log(newPv.value);
      if(newPv.value.pv instanceof File){
        const formData = new FormData();
        formData.append("pv", newPv.value.pv);

        const { data: { url } } = await uploadPvAdmin(newPv.value.user, formData);

        newPv.value.pv = url;
      }

      const plainPv = {
        name: newPv.value.name,
        description: newPv.value.description,
        user: newPv.value.user,
        pv: newPv.value.pv,
      };

      await updatePv(newPv.value._id, plainPv);
      toast.success("Pv modifier avec succès!", { autoClose: 3000, });
      closePvModal();
      window.location.reload();
    }else{
      const formData = new FormData();
      formData.append("pv", newPv.value.pv);

      const { data: { url } } = await uploadPvAdmin(newPv.value.user, formData);

      newPv.value.pv = url;

      const plainPv = {
        name: newPv.value.name,
        description: newPv.value.description,
        user: newPv.value.user,
        pv: newPv.value.pv,
      };

      await addPv(plainPv);
      toast.success("Pv ajouté avec succès!", { autoClose: 3000, });
      closePvModal();
      window.location.reload();
    }
  } catch (error) {
    toast.error("Erreur lors de l'ajout du pv", { autoClose: 3000, });
    console.error(error.response?.data?.message);
  } finally {
    isLoading.value = false;
  }
};

const handleFileUpload = (pv) => {
  const file = pv.target.files[0];
  if (file && file.type === "application/pdf") {
    pdfPreviewUrl.value = URL.createObjectURL(file);
    newPv.value.pv = file;
  } else {
    toast.error("Veuillez sélectionner un fichier PDF valide!", { autoClose: 3000, });
  }
};

const filteredUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const getUserName = (userData) =>{
  const user = users.value.find((u) => u._id === userData);
  return user ? `${user.firstName} ${user.lastName}` : '';
}

const deletePvFunction = async (pv) => {
  await confirm(
    "Etes-vous sûr de vouloir supprimer ce PV?",
    async () => {
      await deletePv(pv._id);
      toast.success("PV supprimé avec succès!", { autoClose: 3000, });
    }
  );
};

// office

const offices = ref([
  {
    _id: 0,
    name: "",
    email: "",
    abb: "",
    slogan: "",
    description: "",
    picture: null,
    backgroundPicture: null,
    status: "",
    archive: "",
    president: "",
    vice: "",
    secretary: "",
    pvs: [{
      name: "",
      description: "",
      pv: ""
    }],
    poles: [{
      _id: 0,
      name: "",
      res: "",
      members: []
    }]
  }
]);

const officeFilters = ref({
  search: "",
  status: "",
});

onMounted(async () => {
  const officeData = await allOffices();
  if (officeData && officeData.data) {
    const updatedOffices = officeData.data.map(office => {
      if (office.picture) {
        const pictureName = office.picture.split('/').pop();
        office.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${office._id}/${pictureName}`;
      }
      if (office.backgroundPicture) {
        const pictureName = office.backgroundPicture.split('/').pop();
        office.backgroundPicture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${office._id}/${pictureName}`;
      }
      if (office.president?.picture) {
        const pictureName = office.president.picture.split('/').pop();
        office.president.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${office.president._id}/${pictureName}`;
      }
      if (office.pvs) {
        office.pvs.map(pv => { pv.dateCreated = new Date(pv.dateCreated).toISOString().replace('T', ' ').slice(0, 16); });
      }
      office.dateCreated = new Date(office.dateCreated).toISOString().replace('T', ' ').slice(0, 16);
      return office;
    });
    offices.value = updatedOffices;
  }
});

const filterOffices = () => {
  return offices.value.filter((office) => {
    const searchMatch = officeFilters.value.search
      ? office.name.toLowerCase().includes(officeFilters.value.search.toLowerCase()) ||
      office.email.toLowerCase().includes(officeFilters.value.search.toLowerCase()) ||
      office.slogan.toLowerCase().includes(officeFilters.value.search.toLowerCase())
      : true;

    const statusMatch = officeFilters.value.status !== ""
      ? office.status === (officeFilters.value.status === "true")
      : true;

    return searchMatch && statusMatch;
  });
};

const approveOffice = async (id: string) => {
  await confirm(
    "Etes-vous sûr de vouloir approuver la demande de création de ce bureau ? ?",
    async () => {
    try {
      const updatedOffice = {
        status: true
      }
      await updateOffice(id, updatedOffice);
      toast.success("La création du bureau a été approuvée avec succès!!", { autoClose: 3000, });
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'approbation du bureau:", error);
    }
    }
  );
};

const declineOffice = async (id: string) => {
  await confirm(
    "en refusant cette demande vous supprimerez ce bureau, êtes-vous sûr de vouloir refuser la demande de création de ce bureau ?",
    async () => {
    try {
      await deleteOffice(id);
      toast.success("La création d'un bureau a été refusée avec succès!!", { autoClose: 3000, });
      window.location.reload();
    } catch (error) {
      console.error("Error declining office:", error);
    }
    }
  );
};

const archiveOffice = async (office: object) => {
  await confirm(
    "êtes-vous sûr de vouloir archiver ce bureau ?",
    async () => {
    try {
      const updatedOffice = {
        archive: !office.archive
      }
      await updateOffice(office._id, updatedOffice);
      toast.success("Bureau archivé avec succès!!", { autoClose: 3000, });
      window.location.reload();
    } catch (error) {
      console.error("Error archiving office:", error);
    }
    }
  );
};

const showPasswordModal = (officeId: string) => {
  currentOfficeId.value = officeId;
  isPasswordModalOpen.value = true;
};

const closePasswordModal = () => {
  isPasswordModalOpen.value = false;
  newPassword.value = '';
  confirmPassword.value = '';
};

const showProfileModal = async (officeId: string) => {
  currentOfficeId.value = officeId;
  isProfileModalOpen.value = true;

  const office = offices.value.find((office) => office._id === officeId);
  if (office) {
    updatedOffice.value = {
      name: office.name,
      email: office.email,
      abb: office.abb,
      slogan: office.slogan,
      description: office.description,
      president: office.president?._id || '',
      vice: office.vice?._id || '',
      secretary: office.secretary?._id || ''
    };
  }
};

const closeProfileModal = () => {
  isProfileModalOpen.value = false;
  updatedOffice.value = {
    name: '',
    email: '',
    abb: '',
    slogan: '',
    description: '',
    president: '',
    vice: '',
    secretary: ''
  };
};

const updatePassword = async () => {
  if (newPassword.value === confirmPassword.value) {
    await resetOfficePassword(currentOfficeId.value, { password: newPassword.value });
    toast.success('Mot de passe mis à jour pour le bureau', { autoClose: 3000, });
    closePasswordModal();
  } else {
    toast.error('Les mots de passe ne correspondent pas', { autoClose: 3000, });
  }
};

const updateProfile = async () => {
  try {
    const sentOffice = {
      name: updatedOffice.value.name,
      email: updatedOffice.value.email,
      abb: updatedOffice.value.abb,
      slogan: updatedOffice.value.slogan,
      description: updatedOffice.value.description,
      president: updatedOffice.value.president,
      vice: updatedOffice.value.vice,
      secretary: updatedOffice.value.secretary
    };
    await updateOffice(currentOfficeId.value, sentOffice);
    toast.success('Profil mis à jour pour le bureau', { autoClose: 3000, });
    closeProfileModal();
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

//contact

const contacts = ref([
  {
    _id: 0,
    name: "",
    email: "",
    message: "",
    status: false,
    dateCreated: ""
  }
]);

const contactFilters = ref({
  sortBy: "A-Z",
  status: ""
});

onMounted(async () => {
  const contactData = await allContacts();
  if (contactData && contactData.data) {
    const updatedContact = contactData.data.map(contact => {
      contact.dateCreated = new Date(contact.dateCreated).toISOString().replace('T', ' ').slice(0, 16);
      return contact;
    });
    contacts.value = updatedContact;
  }
});

const filterContacts = () => {
  let filteredContacts = contacts.value;

  if (contactFilters.value.status !== "") {
    filteredContacts = filteredContacts.filter(contact => contact.status === (contactFilters.value.status === "true"));
  }

  switch (contactFilters.value.sortBy) {
    case "A-Z":
      filteredContacts = filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      filteredContacts = filteredContacts.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
      break;
    case "oldest":
      filteredContacts = filteredContacts.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
      break;
    case "done":
      filteredContacts = filteredContacts.filter(contact => contact.status === true);
      break;
    case "undone":
      filteredContacts = filteredContacts.filter(contact => contact.status === false);
      break;
  }

  return filteredContacts;
};

const markAsDone = async (contact: object) => {
  await confirm(
    "Etes-vous sûr d'avoir résolu cette demande de contact?",
    async () => {
    try {
      await updateContact(contact._id, { status: true })
      toast.success("Contact mis à jour avec succès", { autoClose: 3000, });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    }
  );
};

// events

const events = ref([]);

const eventFilters = ref({
  archive: '',
  active: '',
  office: '',
});

onMounted(async () => {
  const eventData = await allEvents();
  if (eventData && eventData.data) {
    const filteredEvents = eventData.data;
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
    updateInactiveEventCount();
  }
});

const updateInactiveEventCount = () => {
  inactiveEventCount.value = events.value.filter(event => !event.active).length;
};

const filteredEvents = () => {
  return events.value.filter(event => {
    let isValid = true;

    if (eventFilters.value.archive !== '' && event.archive !== JSON.parse(eventFilters.value.archive)) {
      isValid = false;
    }
    if (eventFilters.value.active !== '' && event.active !== JSON.parse(eventFilters.value.active)) {
      isValid = false;
    }
    if (eventFilters.value.office && event.office._id !== eventFilters.value.office) {
      isValid = false;
    }

    return isValid;
  });
};

const prev = (event : object) => {
  if (Array.isArray(event.posters) && event.posters.length > 0) {
    const eventId = event._id;
    if (currentIndices.value[eventId] === undefined) {
      currentIndices.value[eventId] = 0;
    }
    currentIndices.value[eventId] = (currentIndices.value[eventId] - 1 + event.posters.length) % event.posters.length;
  }
};

const next = (event : object) => {
  if (Array.isArray(event.posters) && event.posters.length > 0) {
    const eventId = event._id;
    if (currentIndices.value[eventId] === undefined) {
      currentIndices.value[eventId] = 0;
    }
    currentIndices.value[eventId] = (currentIndices.value[eventId] + 1) % event.posters.length;
  }
};

const openNoteModal = (eventId : string) => {
  selectedEventId.value = eventId;
  isNoteModalOpen.value = true;
};

const closeNoteModal = () => {
  isNoteModalOpen.value = false;
  noteMessage.value = "";
  selectedEventId.value = null;
};

const submitNote = async (eventId: string) => {
  if (noteMessage.value && selectedEventId.value) {
    try{
      await updateEvent(eventId, {note:noteMessage.value});
      toast.success("Remarque ajoutée avec succès", { autoClose: 3000, });
      window.location.reload();
      closeNoteModal();
    }catch(error){
      console.log(error);
    }
  }
};

const approveEvent = async (eventId : string) => {
  await confirm(
    "êtes-vous sûr de vouloir approuver la publication de cet événement ?",
    async () => {
    try{
      await updateEvent(eventId, {active:true});
      toast.success("Event Approved Successfully", { autoClose: 3000, });
      window.location.reload();
    }catch(error){
      console.log(error);
    }
    }
  );
};

const toggleNote = () => {
  isNoteExpanded.value = !isNoteExpanded.value;
};

const truncatedNote = (note: string) => {
  const maxLength = 20;
  return note.length > maxLength ? note.slice(0, maxLength) + "..." : note;
};

// joins

const joins = ref([
  {
    _id: 0,
    name: "",
    user_id: "",
    email: "",
    office: "",
    pole: "",
    status: false,
    reason: "",
    dateCreated: ""
  }
]);

const joinFilters = ref({
  date: '',
  office: '',
  status: ''
});

onMounted(async () => {
  const joinData = await allJoins();
  if (joinData && joinData.data) {
    joinData.data.forEach(item => {
      if (item.office && item.office.picture) {
        const pictureName = item.office.picture.split('/').pop();
        item.office.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${item.office._id}/${pictureName}`;
      }
      if (item.user && item.user.picture) {
        const pictureName = item.user.picture.split('/').pop();
        item.user.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${item.user._id}/${pictureName}`;
      }
      item.dateCreated = new Date(item.dateCreated).toISOString().replace('T', ' ').slice(0, 16);
    });
    joins.value = joinData.data;
  }
});

const filterJoins = () => {
  return joins.value.filter(join => {
    let isValid = true;

    if (
      joinFilters.value.office &&
      (!join.office || join.office._id !== joinFilters.value.office)
    ) {
      isValid = false;
    }

    if (joinFilters.value.status !== '' && join.status !== JSON.parse(joinFilters.value.status)) {
      isValid = false;
    }

    return isValid;
  });
};

// general

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const getRôleName = (role: string) => {
  const roles: { [key: string]: string } = {
    '0': 'Admin',
    '1': 'User'
  };
  return roles[role];
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const selectSection = (section: string) => {
  activeSection.value = section;
  showFilters.value = false;
  if (window.innerWidth <= 768) {
    isSidebarOpen.value = false;
  }
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<style scoped>
@import './dashboard.css';
</style>
