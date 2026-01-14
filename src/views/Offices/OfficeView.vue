<template>
  <div class="office-profile">

    <div class="cover-photo">
      <img :src="coverPreview || office.backgroundPicture || defaultBackgroundPicture"
          alt="Cover Photo"
          class="cover-image">
      <div v-if="currentId === id" class="change-cover-btn" @click="triggerFileInput('cover')">
        Changer la couverture
      </div>
      <input type="file" ref="coverInput" class="d-none" @change="(event) => handleImageChange(event, 'cover')" accept="image/*" >

      <div class="profile-picture-container">
        <img :src="profilePreview || office.picture || defaultPicture" alt="Profile Picture" class="profile-picture">
        <div v-if="currentId === id" class="change-profile-btn" @click="triggerFileInput('profile')">
          <i class="fa fa-camera"></i>
        </div>
        <input
          type="file"
          ref="profileInput"
          class="d-none"
          @change="(event) => handleImageChange(event, 'profile')"
          accept="image/*"
        >
      </div>

      <div v-if="currentId === id" class="save-button-container">
        <button v-show="hasChanges"  @click="saveChanges" class="save-changes-btn" >Save Changes</button>
        <button v-show="hasChanges"  @click="cancelBtn" class="cancel-changes-button" >Cancel</button>
      </div>
    </div>

    <div class="office-info">
      <h1>{{ office.name }} | <span>{{ office.abb }}</span></h1>
      <p class="slogan">{{ office.slogan }}</p>
    </div>

    <div class="nav-tabs">
      <button v-if="currentId === id"
        v-for="(tab, index) in ['pvs', 'membres', 'événements', 'archive', 'Revendications d adhésion', 'contact']" :key="'currentId-' + tab + index"
        class="tab-button" :class="{ active: activeTab === tab }" @click="switchTab(tab)">
        {{ tab }}
      </button>
      <button v-else-if="role === '0'"
        v-for="(tab, index) in ['pvs', 'membres', 'événements', 'archive', 'contact']" :key="'currentId-' + tab + index"
        class="tab-button" :class="{ active: activeTab === tab }" @click="switchTab(tab)">
        {{ tab }}
      </button>
      <button v-else
        v-for="(tab, index) in ['membres', 'événements', 'archive', 'contact']" :key="'currentId-' + tab + index"
        class="tab-button" :class="{ active: activeTab === tab }" @click="switchTab(tab)">
        {{ tab }}
      </button>
    </div>

    <div class="tab-content">

      <div class="pvs-section" v-if="activeTab === 'pvs'">
        <button v-if="currentId === id" class="add-button" @click="openPvModal">Ajouter un nouveau PV</button>
        <div class="pv-list">
          <div class="pv-item" v-for="(pv, i) in office.pvs" :key="pv._id" v-if="office.pvs">
            <button v-if="currentId === id" class="delete-button" @click="deletePv(i)">×</button>
            <h3>{{ pv.name }}</h3>
            <p>{{ pv.description }}</p>
            <p>{{ pv.dateCreated }}</p>
            <a :href="getPdfPreviewUrl(pv.pv)" class="download-button" download>Télécharger</a>
          </div>
          <p v-if="office.pvs.length === 0" class="no-event-message">Aucun rapport n'a encore été enregistré. Publiez votre nouveau rapport maintenant!</p>
        </div>
      </div>

      <div class="members-section" v-if="activeTab === 'membres'">
        <div class="executive-cards">
          <div class="card executive-card">
            <img :src="presidentData?.picture || defaultPicture" alt="President" />
            <div class="card-info">
              <h3>{{ presidentData?.firstName }} {{ presidentData?.lastName }}</h3>
              <p>Président(e)</p>
            </div>
            <i v-if="currentId === id" class="fas fa-edit" @click="openEditExecutiveModal('president')"></i>
            <button v-if="!office.president && currentId === id" class="add-executive-button" @click="openAddExecutiveModal('president')">
              <i class="fas fa-plus"></i>
            </button>
          </div>

          <div class="card executive-card">
            <img :src="viceData?.picture || defaultPicture" alt="Vice President" />
            <div class="card-info">
              <h3>{{ viceData?.firstName }} {{ viceData?.lastName }}</h3>
              <p>vice-président(e)</p>
            </div>
            <i v-if="currentId === id" class="fas fa-edit" @click="openEditExecutiveModal('vice')"></i>
            <button v-if="!office.vice && currentId === id" class="add-executive-button" @click="openAddExecutiveModal('vice')">
              <i class="fas fa-plus"></i>
            </button>
          </div>

          <div class="card executive-card">
            <img :src="secretaryData?.picture || defaultPicture" alt="Secretary" />
            <div class="card-info">
              <h3>{{ secretaryData?.firstName }} {{ secretaryData?.lastName }}</h3>
              <p>Secrétaire</p>
            </div>
            <i v-if="currentId === id" class="fas fa-edit" @click="openEditExecutiveModal('secretary')"></i>
            <button v-if="!office.secretary && currentId === id" class="add-executive-button" @click="openAddExecutiveModal('secretary')">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <div v-if="showAddExecutiveModal || showEditExecutiveModal" class="modal">
          <div class="modal-content">
            <h2>{{ executiveRole === 'president' ? 'President' : executiveRole === 'vice' ? 'Vice President' : 'Secretary' }}</h2>
            <form @submit.prevent="saveExecutive">
              <div class="form-group">
                <label>Sélectionner l'utilisateur</label>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Rechercher un utilisateur..."
                />
                <select v-model="executiveUser" size=5>
                  <option v-for="user in filteredUsers" :key="user._id" :value="user">
                    {{ user.firstName }} {{ user.lastName }}
                  </option>
                </select>
              </div>
              <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
              <div class="modal-buttons">
                <button type="submit" :disabled="isLoading">Sauvegarder</button>
                <button type="button" :disabled="isLoading"@click="showEditExecutiveModal ? closeEditExecutiveModal() : closeAddExecutiveModal()">Annuler</button>
              </div>
            </form>
          </div>
        </div>

        <h2>Les Pôles</h2>
        <div class="poles-bar">
          <button
            v-for="pole in office.poles"
            :key="pole.name"
            class="pole-button"
            :class="{ active: activePole === pole.name }"
            @click="switchPole(pole.name)"
          >
            {{ pole.name }}
            <i v-if="activePole?.name === pole.name && currentId === id" class="fas fa-edit" @click.stop="openEditPoleModal(pole)"></i>
          </button>
          <button v-if="currentId === id" class="add-pole-button" @click="openAddPoleModal" >
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <div v-if="activePole" class="pole-content">
          <h3>{{ activePole.description }}</h3>
          <div class="card responsible-card">
            <img :src="activePole.res?.picture || defaultPicture" alt="Responsible" />
            <div class="card-info">
              <h3>{{ activePole.res?.firstName }} {{ activePole.res?.lastName }}</h3>
              <p>Responsable</p>
            </div>
          </div>

          <div class="member-cards">
            <div v-for="member in activePole.members" :key="member._id" class="card">
              <img :src="member.picture || defaultPicture" alt="Member" />
              <div class="card-info">
                <h3>{{ member.firstName }} {{ member.lastName }}</h3>
              </div>
              <i v-if="currentId === id" class="fas fa-times" @click="removeMember(activePole._id,member._id)"></i>
            </div>

            <div v-if="currentId === id" class="card add-member-card" @click="openAddMemberModal(activePole)">
              <i class="fas fa-plus"></i>
              <p>Ajouter un membre</p>
            </div>
          </div>
        </div>

        <div v-if="showAddPoleModal" class="modal">
          <div class="modal-content">
            <h2>Ajouter un nouveau pôle</h2>
            <form @submit.prevent="addPole">
              <div class="form-group">
                <label>Nom du pôle</label>
                <input v-model="newPole.name" type="text" required />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="newPole.description" required></textarea>
              </div>
              <div class="form-group">
                <label>Responsable</label>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Rechercher un responsable..."
                />
                <select v-model="newPole.res" size=5>
                  <option v-for="user in filteredUsers" :key="user._id" :value="user">
                    {{ user.firstName }} {{ user.lastName }}
                  </option>
                </select>
              </div>
              <div class="modal-buttons">
                <button type="submit">Sauvegarder</button>
                <button type="button" @click="closeAddPoleModal">Annuler</button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="showEditPoleModal" class="modal">
          <div class="modal-content">
            <i class="fas fa-times" @click="removePole"> Delete Pole</i>
            <h2>Modifier le pôle</h2>
            <form @submit.prevent="updatePole">
              <div class="form-group">
                <label>Nom du pôle</label>
                <input v-model="editPole.name" type="text" required />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="editPole.description" required></textarea>
              </div>
              <div class="form-group">
                <label>Responsable</label>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search for a responsible..."
                />
                <select v-model="editPole.res" size=5>
                  <option v-for="user in filteredUsers" :key="user._id" :value="user">
                    {{ user.firstName }} {{ user.lastName }}
                  </option>
                </select>
              </div>
              <div class="modal-buttons">
                <button type="submit">Sauvegarder</button>
                <button type="button" @click="closeEditPoleModal">Annuler</button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="showAddMemberModal" class="modal">
          <div class="modal-content">
            <h2>Ajouter un nouveau membre</h2>
            <form @submit.prevent="addMember">
              <div class="form-group">
                <label>Membre</label>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Rechercher un membre..."
                />
                <select v-model="newMember" size=5>
                  <option v-for="user in filteredUsers" :key="user._id" :value="user">
                    {{ user.firstName }} {{ user.lastName }}
                  </option>
                </select>
              </div>
              <div class="modal-buttons">
                <button type="submit">Sauvegarder</button>
                <button type="button" @click="closeAddMemberModal">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="activities-section" v-if="activeTab === 'événements'">
        <div v-if="currentId === id" class="filter-section">
          <select v-model="eventFilter" id="filter">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="all">Tout</option>
          </select>
        </div>
        <button v-if="currentId === id" class="add-button" @click="openEventModal(null)">Ajouter un nouvel événement</button>
        <div class="event-list">
          <div class="event-card" v-for="(event, index) in filteredEvents" :key="index" v-if="filteredEvents.length>0">
            <div v-if="event.note && event.active === false" class="note-bubble" @click="toggleNote">
              <span class="note-preview">{{ truncatedNote(event.note) }}</span>
              <div v-if="isNoteExpanded" class="note-full">
                {{ event.note }}
              </div>
            </div>
            <div class="event-image">
              <button v-if="currentId === id" @click="openEventModal(event)" class="update-button">Mettre à jour</button>
              <div class="carousel">
                <button v-if="event.posters.length > 1" @click="prev(event)" class="nav-btn left-btn">&lt;</button>
                <div class="carousel-display">
                  <img :src="event.posters[getCurrentIndex(event._id)]" :alt="'Poster ' + (getCurrentIndex(event._id) + 1)" />
                </div>
                <button v-if="event.posters.length > 1" @click="next(event)" class="nav-btn right-btn">&gt;</button>
              </div>
            </div>
            <div class="event-info">
              <p v-if="event.updateStatus"><strong><span class="édité">édité</span></strong></p>
              <button v-if="currentId === id" @click="deleteEventFunction(event._id)" class="delete-button">X</button>
              <h3>{{ event.name }}</h3>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-details">
                <p> <strong>📅 Date:</strong>
                  <span class="span-event" v-if="formatDate(event.startDate) === formatDate(event.endDate)"> {{ formatDate(event.startDate) }} </span>
                  <span class="span-event" v-else> {{ formatDate(event.startDate) }} / {{ formatDate(event.endDate) }} </span>
                </p>
                <p>🕒 <strong>De:</strong>{{ formatTime(event.startDate) }} | <strong>à:</strong> {{ formatTime(event.endDate) }}</p>
                <p>📍 <strong>Localisation:</strong> {{ event.location }}</p>
                <p>
                  <span class="span-event" v-if="event.ticket?.intern">🎫 <strong>Prix Externes:</strong> {{ event.ticket.intern }} DH</span>
                  <span class="span-event" v-if="event.ticket?.intern && event.ticket?.extern"> | </span>
                  <span class="span-event" v-if="event.ticket?.extern">🎫 <strong>Prix Internes:</strong> {{ event.ticket.extern }} DH</span>
                </p>
                <p v-if="event.activities.length > 0"><strong>Activitees:</strong> {{ event.activities.join(', ') }}</p>
                <p v-if="event.collaborators.length > 0"><strong>Collaborateur:</strong> {{ event.collaborators.join(', ') }}</p>
                <p>Creer le {{ event.dateCreated }}</p>
              </div>
            </div>
          </div>
          <p v-else class="no-event-message">Aucun événement n'est disponible pour le moment. Restez à l'écoute des activités à venir et des opportunités passionnantes!</p>
        </div>
      </div>

      <div class="archive-section" v-if="activeTab === 'archive'">
        <div class="event-list">
          <div class="event-card" v-for="(event, index) in eventsArchive" :key="index" v-if="eventsArchive.length>0">
            <div class="event-image">
              <div class="carousel">
                <button v-if="event.posters.length > 1" @click="prev(event)" class="nav-btn left-btn">&lt;</button>
                <div class="carousel-display">
                  <img :src="event.posters[getCurrentIndex(event._id)]" :alt="'Poster ' + (getCurrentIndex(event._id) + 1)" />
                </div>
                <button v-if="event.posters.length > 1" @click="next(event)" class="nav-btn right-btn">&gt;</button>
              </div>
            </div>
            <div class="event-info">
              <h3>{{ event.name }}</h3>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-details">
                <p> <strong>📅 Date:</strong>
                  <span class="span-event" v-if="formatDate(event.startDate) === formatDate(event.endDate)"> {{ formatDate(event.startDate) }} </span>
                  <span class="span-event" v-else> {{ formatDate(event.startDate) }} / {{ formatDate(event.endDate) }} </span>
                </p>
                <p>🕒 <strong>De:</strong>{{ formatTime(event.startDate) }} | <strong>à:</strong> {{ formatTime(event.endDate) }}</p>
                <p>📍 <strong>Localisation:</strong> {{ event.location }}</p>
                <p>
                  <span class="span-event" v-if="event.ticket?.intern">🎫 <strong>Prix Externes:</strong> {{ event.ticket.intern }} DH</span>
                  <span class="span-event" v-if="event.ticket?.intern && event.ticket?.extern"> | </span>
                  <span class="span-event" v-if="event.ticket?.extern">🎫 <strong>Prix Internes:</strong> {{ event.ticket.extern }} DH</span>
                </p>
                <p v-if="event.activities.length > 0"><strong>Activitees:</strong> {{ event.activities.join(', ') }}</p>
                <p v-if="event.collaborators.length > 0"><strong>Collaborateur:</strong> {{ event.collaborators.join(', ') }}</p>
                <p>Creer le {{ event.dateCreated }}</p>
              </div>
            </div>
          </div>
          <p v-else class="no-event-message">Aucune activité précédente n'est encore disponible. Faites partie du voyage et joignez-vous à nous pour créer des souvenirs durables!</p>
        </div>
      </div>

      <div class="join-section" v-if="activeTab === 'Revendications d adhésion'">
        <div class="sort-controls">
          <label>
            <input type="radio" v-model="sortBy" value="all" /> Tout
          </label>
          <label>
            <input type="radio" v-model="sortBy" value="accepted" /> Accepté
          </label>
          <label>
            <input type="radio" v-model="sortBy" value="pending" /> En attente
          </label>
        </div>
        <div v-if="joinLength">
          <div v-for="(joinItem, index) in sortedJoinRequests" :key="index">
            <p><strong>Nom:</strong> {{ joinItem.name }}</p>
            <p><strong>E-mail:</strong> {{ joinItem.email }}</p>
            <p><strong>Raison:</strong> {{ joinItem.reason }}</p>
            <p><strong>Pôle:</strong> {{ joinItem.pole }}</p>
            <p><strong>Statut:</strong> {{ joinItem.status ? 'Accepted' : 'Pending' }}</p>
            <p><strong>Date de création:</strong> {{ joinItem.dateCreated }}</p>
            <button v-if="!joinItem.status && currentId === id" @click="approveJoinRequest(joinItem)" class="approve-button" > Approuver </button>
            <hr>
          </div>
        </div>
        <p v-else class="no-event-message">No one has requested to join yet. Publish interesting events to attracts new members!</p>
      </div>

      <div class="contact-section" v-if="activeTab === 'contact' ">
        <div class="contact-info">
          <button v-if="currentId === id" @click="isEditing ? saveProfile() : toggleEdit()" class="edit-button">
            {{ isEditing ? 'Sauvegarder' : 'Modifier' }}
          </button>
          <button v-if="isEditing && currentId === id" @click="cancelEdit" class="cancel-button">
            Annuler
          </button>
          <h2>Informations sur le bureau</h2>
          <div class="info-container">
            <div class="info-item">
              <strong>Nom</strong>
              <span v-if="!isEditing">{{ office.name }}</span>
              <input v-else v-model="office.name" type="text" />
            </div>
            <div class="info-item">
              <strong>abréviation</strong>
              <span v-if="!isEditing">{{ office.abb }}</span>
              <input v-else v-model="office.abb" type="text" />
            </div>
            <div class="info-item">
              <strong>Description</strong>
              <span v-if="!isEditing">{{ office.description }}</span>
              <input v-else v-model="office.description" type="text" />
            </div>
            <div class="info-item">
              <strong>Slogan</strong>
              <span v-if="!isEditing">{{ office.slogan }}</span>
              <input v-else v-model="office.slogan" type="text" />
            </div>
            <div class="info-item">
              <strong>E-mail</strong>
              <span v-if="!isEditing">{{ office.email }}</span>
              <input v-else v-model="office.email" type="email" />
            </div>

            <div class="info-item">
              <strong><span>{{ office.dateCreated }}</span></strong>
            </div>
          </div>
          <div class="contact-form" v-if="user && role === '1'" >
            <span>
              <h2>Rejoignez-nous</h2>
            </span>
            <form @submit.prevent="joinUs">
              <input type="text" v-model="name" placeholder="Votre nom" required />
              <input type="email" v-model="email" placeholder="Votre email" required />
              <select v-model="pole" required>
                <option value="" disabled selected>A quel pôle souhaitez-vous vous joindre?</option>
                <option v-for="pole in office.poles" :key="pole._id" :value="pole.name">
                  {{ pole.name }}
                </option>
              </select>
              <textarea placeholder="Votre raison de nous rejoindre" v-model="reason" required></textarea>
              <button type="submit">Envoyer la demande</button>
            </form>
            <p v-if="messageSent" class="success-message">Demande envoyée avec succès!</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" v-if="showPvModal && (currentId === id)">
      <div class="modal-content">
        <h2>Ajouter un nouveau PV</h2>
        <form class="pv-form" @submit="handlePvSubmit">
          <div class="form-group">
            <label>Nom</label>
            <input type="text" v-model="newPv.name" placeholder="Entrez le nom du PV">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newPv.description" placeholder="Entrez la description"></textarea>
          </div>
          <div class="form-group">
            <label>Fichier (.PDF)</label>
            <input type="file" @change="handleFileUpload" accept=".pdf">
          </div>
          <div v-if="pdfPreviewUrl">
            <h3>Aperçu</h3>
            <iframe :src="pdfPreviewUrl" width="100%" height="500px"></iframe>
          </div>
          <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
          <div class="modal-buttons">
            <button type="submit" :disabled="isLoading" class="submit-button">Sauvegarder</button>
            <button type="button" :disabled="isLoading" cclass="cancel-button" @click="closePvModal">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal" v-if="showEventModal && (currentId === id)">
      <div class="modal-content">
        <h2>{{ isEditMode ? "Mise à jour de l'événement" : "Ajouter un nouvel événement" }}</h2>
        <h3 v-if="!isEditMode">Ajoutez au moins une image d'environ 560px de hauteur pour l'affichage dans écran dans la page d'accueil</h3>
        <form class="event-form" @submit.prevent="isEditMode ? updateEventFunction(newEvent._id) : handleEventSubmit()">
          <div class="form-group">
            <label>Nom de l'événement</label>
            <input type="text" v-model="newEvent.name" placeholder="nom.." required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newEvent.description" placeholder="description.." required></textarea>
          </div>
          <div class="form-group">
            <label>Date de début</label>
            <input v-model="newEvent.startDate" :min="!isEditMode ? getMinDate() : undefined" type="datetime-local" required>
          </div>
          <div class="form-group">
            <label>Date Fin</label>
            <input v-model="newEvent.endDate" :min="newEvent.startDate" type="datetime-local" required>
          </div>
          <div class="form-group">
            <label>Lieu de l'événement</label>
            <input type="text" v-model="newEvent.location" placeholder="Lieu de l'événement.." required>
          </div>
          <div class="form-group">
            <label>Activités</label>
            <input type="text" v-model="activityName" placeholder="Entrer dans les activités..">
            <button type="button" @click="addActivity">Ajouter</button>
            <ul>
              <li v-for="(activity, index) in newEvent.activities" :key="index">
                {{ activity }}
                <button type="button" @click="removeActivity(index)">X</button>
              </li>
            </ul>
          </div>
          <div class="form-group">
            <label>Collaborateurs</label>
            <input type="text" v-model="collaboratorName" placeholder="Entrez le collaborateur..">
            <button type="button" @click="addCollaborator">Ajouter</button>
            <ul>
              <li v-for="(collaborator, index) in newEvent.collaborators" :key="index">
                {{ collaborator }}
                <button type="button" @click="removeCollaborator(index)">X</button>
              </li>
            </ul>
          </div>
          <div class="form-group">
            <label>Tiket Intern</label>
            <input type="checkbox" v-model="internEnabled"> Activer
            <input
              type="number"
              v-model="newEvent.ticket.intern"
              placeholder="prix.."
              :disabled="!internEnabled"
            >
          </div>
          <div class="form-group">
            <label>Tiket Extern</label>
            <input type="checkbox" v-model="externEnabled"> Activer
            <input
              type="number"
              v-model="newEvent.ticket.extern"
              placeholder="prix.."
              :disabled="!externEnabled"
            >
          </div>
          <div class="form-group">
            <label>Affiches</label>
            <input type="file" @change="handleImageUpload" multiple>
            <div v-if="imagePreviewUrls.length">
              <h3>Aperçu</h3>
              <div v-for="(url, index) in imagePreviewUrls" :key="index" class="image-preview">
                <img :src="url" alt="Preview" width="200" required>
                <button type="button" @click="removeImage(index)" class="remove-button">X</button>
              </div>
            </div>
          </div>
          <Spinner :isLoading="isLoading" message="Téléchargement en cours, veuillez patienter..." />
          <div class="modal-buttons">
            <button type="submit" :disabled="isLoading" cclass="submit-button">{{ isEditMode ? 'Mise à jour' : 'Sauvegarder' }}</button>
            <button type="button" :disabled="isLoading" cclass="cancel-button" @click="closeEventModal">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from 'vue-router';
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';
import { confirm } from '@/components/confirm';
import { parseJwt } from '@/components/jwt';
import { addEvent, allOfficeEvents, deleteEvent, updateEvent } from '@/services/EventApi';
import { addJoin, getJoinsOffice, updateJoin } from '@/services/JoinApi';
import { getOffice, updateOffice } from '@/services/OfficeApi';
import { uploadPvOffice, uploadOfficeImage, uploadAvatar, uploadOfficeBackground } from '@/services/PictureApi';
import { allOfficePosts } from '@/services/PostApi';
import { allUsers, getUser } from '@/services/UserApi';
import Spinner from '@/components/Spinner/spinner.vue';

const route = useRoute();
const isLoading = ref(false);
const id = route.params.id;
const user = ref("");
const role = ref("");
const currentId = ref("");
const name = ref("");
const email = ref("");
const pole = ref("");
const reason = ref("");
const messageSent = ref(false);
const activeTab = ref('contact');
const showPvModal = ref(false);
const showEventModal = ref(false);
const showPostModal = ref(false);
const defaultPicture = new URL('/pictures/profile.png', import.meta.url).href;
const defaultBackgroundPicture = new URL('/pictures/background.jpg', import.meta.url).href;
const pdfPreviewUrl = ref(null);
const joinLength = ref(false);
const collaboratorName = ref("");
const activityName = ref("");
const internEnabled = ref(false);
const externEnabled = ref(false);
const imagePreviewUrls = ref([]);
type CurrentIndices = {[key: string]: number;};
const currentIndices = ref<CurrentIndices>({});
const profileInput = ref(null);
const coverInput = ref(null);
const profilePreview = ref('');
const coverPreview = ref('');
const profileFile = ref(null);
const coverFile = ref(null);
const isEditMode = ref(false);
const sortBy = ref('all');
const isEditing = ref(false);
const activePole = ref(null);
const showAddPoleModal = ref(false);
const showEditPoleModal = ref(false);
const showAddMemberModal = ref(false);
const newPole = ref({ name: "", description: "", res: null });
const editPole = ref({ name: "", description: "", res: null });
const newMember = ref(null);
const searchQuery = ref("");
const users = ref([]);
const presidentData = ref(null);
const viceData = ref(null);
const secretaryData = ref(null);
const showAddExecutiveModal = ref(false);
const showEditExecutiveModal = ref(false);
const executiveRole = ref("");
const executiveUser = ref(null);
const eventFilter = ref('active');
const isNoteExpanded = ref(false);

const office = reactive({
  _id: 0,
  name: "",
  email: "",
  abb: "",
  slogan: "",
  description: "",
  picture: null,
  backgroundPicture: null,
  status: "",
  president: "",
  vice: "",
  secretary: "",
  pvs: [{
    _id: 0,
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
});

onMounted(async () => {
  const officeData = await getOffice(id);
  if (officeData && officeData.data?._id) {
    if (officeData.data.picture) {
      const pictureName = officeData.data?.picture.split('/').pop();
      officeData.data.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${officeData.data?._id}/${pictureName}`;
    }
    if (officeData.data.backgroundPicture) {
      const backgroundPictureName = officeData.data.backgroundPicture.split('/').pop();
      officeData.data.backgroundPicture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${officeData.data?._id}/${backgroundPictureName}`;
    }
    if(officeData.data.pvs){
      officeData.data.pvs.map(pv => { pv.dateCreated = new Date(pv.dateCreated).toISOString().split('T')[0]; });
    }
    officeData.data.dateCreated = new Date(officeData.data.dateCreated).toISOString().split('T')[0];
    Object.assign(office, officeData.data);
    if (office.president) {
      presidentData.value = await findUser(office.president);
    }
    if (office.vice) {
      viceData.value = await findUser(office.vice);
    }
    if (office.secretary) {
      secretaryData.value = await findUser(office.secretary);
    }
  }
});

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

const getMinDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toggleNote = () => {
  isNoteExpanded.value = !isNoteExpanded.value;
};

const truncatedNote = (note: string) => {
  const maxLength = 20;
  return note.length > maxLength ? note.slice(0, maxLength) + "..." : note;
};

const formatDate = (dateTime: Date) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString();
};

const formatTime = (dateTime: Date) => {
  const date = new Date(dateTime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const openAddExecutiveModal = (role) => {
  executiveRole.value = role;
  showAddExecutiveModal.value = true;
};

const closeAddExecutiveModal = () => {
  showAddExecutiveModal.value = false;
  executiveRole.value = "";
  executiveUser.value = null;
  searchQuery.value = "";
};

const openEditExecutiveModal = (role) => {
  executiveRole.value = role;
  showEditExecutiveModal.value = true;
};

const closeEditExecutiveModal = () => {
  showEditExecutiveModal.value = false;
  executiveRole.value = "";
  executiveUser.value = null;
  searchQuery.value = "";
};

const saveExecutive = async () => {
  if (executiveRole.value && executiveUser.value) {
    const role = executiveRole.value;
    const userId = executiveUser.value._id;

    const isUserInOtherRole = Object.entries(office).some(([key, value]) => {
      return (key === "president" || key === "vice" || key === "secretary") && value === userId && key !== role;
    });

    if (isUserInOtherRole) {
      toast.info("Cet utilisateur est déjà affecté à un autre rôle exécutif.", { autoClose: 3000, });
      return;
    }

    const isUserInPole = office.poles.some((pole) => {
      return pole.members.includes(userId);
    });

    if (isUserInPole) {
      toast.info("Cet utilisateur est déjà membre d'un pôle.", { autoClose: 3000, });
      return;
    }

    office[role] = userId;

    if (role === "president") {
      presidentData.value = executiveUser.value;
    } else if (role === "vice") {
      viceData.value = executiveUser.value;
    } else if (role === "secretary") {
      secretaryData.value = executiveUser.value;
    }

    const dataToSend = {
      [role]: userId,
    };

    try {
      isLoading.value = true;
      const response = await updateOffice(office._id, dataToSend);
      toast.success(response.data?.message, { autoClose: 3000, });
    } catch (error) {
      toast.error(error.response?.data?.message || error, { autoClose: 3000, });
    } finally {
      isLoading.value = false;
    }

    closeAddExecutiveModal();
    closeEditExecutiveModal();
  }
};

const filteredUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const findUser = async (id) => {
  try {
    isLoading.value = true;
    const response = await getUser(id);
    if (response.data.picture) {
      const pictureName = response.data.picture.split('/').pop();
      response.data.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${id}/${pictureName}`;
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    office.poles.forEach((pole) => {
      pole.members = pole.members.filter((member) => member !== id);
    });

    const poles = office.poles.map((pole) => ({
    name: pole.name,
    description: pole.description,
    res: pole.res,
    members: Array.isArray(pole.members)
      ? pole.members.map((member) => (typeof member === 'object' ? member._id : member))
      : [],
    }));

    const dataToSend = { poles };

    await updateOffice(office._id, dataToSend);
    // window.location.reload();
  } finally {
    isLoading.value = false;
  }
};

const loadPoleData = async (pole) => {
  if (pole.res) {
    pole.res = await findUser(pole.res);
  }
  if (pole.members) {
    pole.members = await Promise.all(
      pole.members.map(async (memberId) => await findUser(memberId))
    );
  }
};

const switchPole = async (poleName) => {
  activePole.value = office.poles.find((pole) => pole.name === poleName);
  await loadPoleData(activePole.value);
};

const openAddPoleModal = () => {
  showAddPoleModal.value = true;
};

const closeAddPoleModal = () => {
  showAddPoleModal.value = false;
  newPole.value = { name: "", description: "", res: null };
  searchQuery.value = "";
};

const addPole = async () => {
  office.poles.push({
    name: newPole.value.name,
    description: newPole.value.description,
    res: newPole.value.res?._id,
    members: []
  });

  const poles = office.poles.map((pole) => ({
    name: pole.name,
    description: pole.description,
    res: pole.res,
    members: Array.isArray(pole.members)
      ? pole.members.map((member) => (typeof member === 'object' ? member._id : member))
      : []
  }));

  const dataToSend = { poles };

  try {
    isLoading.value = true;
    const response = await updateOffice(office._id, dataToSend);
    toast.success(response.data?.message, { autoClose: 3000, });
  } catch (error) {
    toast.error(error.response?.data?.message || error, { autoClose: 3000, });
  } finally {
    isLoading.value = false;
  }

  closeAddPoleModal();
};

const openEditPoleModal = (pole) => {
  editPole.value = { ...pole };
  showEditPoleModal.value = true;
};

const closeEditPoleModal = () => {
  showEditPoleModal.value = false;
  editPole.value = { name: "", description: "", res: null };
  searchQuery.value = "";
};

const updatePole = async () => {
  const poleIndex = office.poles.findIndex((pole) => pole._id === editPole.value._id);
  if (poleIndex !== -1) {
    office.poles[poleIndex] = {
      ...editPole.value,
      res: editPole.value.res?._id,
      members: Array.isArray(editPole.value.members)
        ? editPole.value.members.map((member) => (typeof member === 'object' ? member._id : member))
        : [],
    };
  }

  const poles = office.poles.map((pole) => ({
    name: pole.name,
    description: pole.description,
    res: pole.res,
    members: Array.isArray(pole.members)
      ? pole.members.map((member) => (typeof member === 'object' ? member._id : member))
      : []
  }));

  const dataToSend = { poles };

  try {
    isLoading.value = true;
    const response = await updateOffice(office._id, dataToSend);
    toast.success(response.data?.message, { autoClose: 3000, });
  } catch (error) {
    toast.error(error.response?.data?.message || error, { autoClose: 3000, });
  } finally {
    isLoading.value = false;
  }
  closeEditPoleModal();
  window.location.reload();
};

const openAddMemberModal = (pole) => {
  activePole.value = pole;
  showAddMemberModal.value = true;
};

const closeAddMemberModal = () => {
  showAddMemberModal.value = false;
  newMember.value = null;
  searchQuery.value = "";
};

const addMember = async () => {
  activePole.value.members.push(newMember.value._id);

  const poles = office.poles.map((pole) => ({
    name: pole.name,
    description: pole.description,
    res: pole.res,
    members: Array.isArray(pole.members)
      ? pole.members.map((member) => (typeof member === 'object' ? member._id : member))
      : []
  }));

  const dataToSend = { poles };

  try {
    isLoading.value = true;
    const response = await updateOffice(office._id, dataToSend);
    toast.success(response.data?.message, { autoClose: 3000, });
  } catch (error) {
    toast.error(error.response?.data?.message || error, { autoClose: 3000, });
  } finally {
    isLoading.value = false;
  }
  closeAddMemberModal();
  window.location.reload();
};

const removeMember = async (poleId, memberId) => {
  await confirm(
    `Etes-vous sûr de vouloir supprimer ce membre !?`,
    async () => {
      const poleIndex = office.poles.findIndex((pole) => pole._id === poleId);

    if (poleIndex !== -1) {
      isLoading.value = true;
      const pole = office.poles[poleIndex];

      pole.members = pole.members.filter((member) => member._id !== memberId);

      office.poles[poleIndex] = {
        ...pole,
        res: pole.res?._id,
        members: Array.isArray(pole.members)
          ? pole.members.map((member) => (typeof member === 'object' ? member._id : member))
          : [],
      };
    }

    const poles = office.poles.map((pole) => ({
      name: pole.name,
      description: pole.description,
      res: pole.res,
      members: Array.isArray(pole.members)
        ? pole.members.map((member) => (typeof member === 'object' ? member._id : member))
        : [],
    }));

    const dataToSend = { poles };

    try {
      const response = await updateOffice(office._id, dataToSend);
      toast.success(response.data?.message, { autoClose: 3000, });
    } catch (error) {
      toast.error(error.response?.data?.message || error, { autoClose: 3000, });
    } finally {
    isLoading.value = false;
  }
    }
  );
};

const removePole = async () => {
  await confirm(
    `Etes-vous sûr de vouloir supprimer le pole ${activePole.value.name} !?`,
    async () => {
    try{
      isLoading.value = true;
      office.poles = office.poles.filter((pole) => pole._id !== activePole.value._id);

      const poles = office.poles.map((pole) => ({
        name: pole.name,
        description: pole.description,
        res: pole.res,
        members: Array.isArray(pole.members)
          ? pole.members.map((member) => (typeof member === 'object' ? member._id : member))
          : [],
      }));

      const dataToSend = { poles };

      try {
        const response = await updateOffice(office._id, dataToSend);
        toast.success(response.data?.message, { autoClose: 3000, });
      } catch (error) {
        toast.error(error.response?.data?.message || error, { autoClose: 3000, });
      }
      closeEditPoleModal();
    }catch(error){
      toast.info("Vous devez d'abord accéder au pole!", { autoClose: 3000, });
    } finally {
      isLoading.value = false;
    }
    window.location.reload();
    }
  );
};

///////////////////////////////////

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const checkAuthentication = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentId.value = JSON.parse(storedUser).data?._id;
    user.value = JSON.parse(storedUser);
    if (user.value.data?.role) {
      role.value = user.value.data?.role;
    }
  }
};

onMounted(() => {
  checkAuthentication();
});

const newPv = {
  name: "",
  description: "",
  pv: null
};

const join = ref([]);

onMounted(async () => {
  const joinData = await getJoinsOffice(id);
  if (joinData && joinData.data) {
    joinData.data.forEach(item => {
      item.dateCreated = new Date(item.dateCreated).toISOString().split('T')[0];
    });
    join.value = joinData.data;
    joinLength.value = true;
  }
});

const approveJoinRequest = async (joinItem) => {
  await confirm(
    "Voulez-vous autoriser cet utilisateur à rejoindre votre bureau ?",
    async () => {
      try {
      isLoading.value = true;
      await updateJoin(joinItem._id, { status: true });
      const pole = office.poles.find((pole) => pole.name === joinItem.pole);
      if (pole) {
        pole.members.push(joinItem.user_id);

        const poles = office.poles.map((pole) => ({
          name: pole.name,
          description: pole.description,
          res: pole.res,
          members: Array.isArray(pole.members)
            ? pole.members.map((member) => (typeof member === 'object' ? member._id : member))
            : []
        }));const dataToSend = { poles };
        await updateOffice(office._id, dataToSend);

        toast.success("Approuvé avec succès!", { autoClose: 3000, });
      } else {
        toast.error("Pôle non trouvé!", { autoClose: 3000, });
      }
      window.location.reload();
    } catch (error) {
      console.error("Error approving join request:", error);
      toast.error("Impossible d'approuver la demande d'adhésion. Veuillez réessayer.", { autoClose: 3000, });
    } finally {
      isLoading.value = false;
    }
    }
  );
};

const sortedJoinRequests = computed(() => {
  if (sortBy.value === 'accepted') {
    return join.value.filter(item => item.status === true);
  } else if (sortBy.value === 'pending') {
    return join.value.filter(item => item.status === false);
  } else {
    return join.value;
  }
});

//events
const events = [{
  _id: null,
  name: "",
  description: "",
  posters: [],
  startDate: "",
  endDate: "",
  location: "",
  note: "",
  activities: [],
  ticket: {
    intern: "",
    extern: ""
  },
  collaborators: [],
  archive: false,
  updateStatus: false,
  active: false,
  office: "",
  dateCreated: ""
}];

const newEvent = ref({
  _id: null,
  name: "",
  description: "",
  posters: [],
  startDate: "",
  endDate: "",
  location: "",
  activities: [],
  ticket: {
    intern: "",
    extern: ""
  },
  collaborators: [],
  office: currentId
});

const eventsArchive = [{
  _id: null,
  name: "",
  description: "",
  posters: [],
  startDate: "",
  endDate: "",
  location: "",
  activities: [],
  ticket: {
    intern: "",
    extern: ""
  },
  collaborators: [],
  archive: false,
  updateStatus: false,
  active: false,
  office: "",
  dateCreated: ""
}];

const processEventData = (eventData) => {
  return eventData.map(item => {
    if (item.posters) {
      const pictureNames = item.posters.map(poster => poster.split('/').pop());
      item.posters = pictureNames.map(pictureName => `${import.meta.env.VITE_API_URL}/api/picture/office-images/${id}/${pictureName}`);
    }
    item.dateCreated = new Date(item.dateCreated).toISOString().replace('T', ' ').slice(0, 16);
    item.startDate = new Date(item.startDate).toISOString().replace('T', ' ').slice(0, 16);
    item.endDate = new Date(item.endDate).toISOString().replace('T', ' ').slice(0, 16);
    return item;
  });
};

onMounted(async () => {
  const eventData = await allOfficeEvents(id);
  if (eventData && eventData.data) {
    const filteredEvents = eventData.data.filter(item => !item.archive);
    const processedEvents = processEventData(filteredEvents);
    events.splice(0, events.length, ...processedEvents);
  }
  const eventArchiveData = await allOfficeEvents(id);
  if (eventArchiveData && eventArchiveData.data) {
    const filteredArchiveEvents = eventArchiveData.data.filter(item => item.archive);
    const processedArchiveEvents = processEventData(filteredArchiveEvents);
    eventsArchive.splice(0, eventsArchive.length, ...processedArchiveEvents);
  }
});

const filteredEvents = computed(() => {
  if (eventFilter.value === 'active') {
    return events.filter(event => event.active);
  } else if (eventFilter.value === 'inactive') {
    return events.filter(event => !event.active);
  }
  return events;
});

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const joinUs = async () => {
  try {
    isLoading.value = true;
    if (user.value.data?._id === id) {
      toast.info("Vous ne pouvez pas rejoindre votre propre bureau!", { autoClose: 3000, });
      return;
    }
    const Join = {
      user_id: user.value.data?._id,
      name: name.value,
      email: email.value,
      office: id,
      reason: reason.value,
      pole: pole.value,
    }
    try {
      await addJoin(Join);
      messageSent.value = true;
      name.value = '';
      email.value = '';
      reason.value = '';
      pole.value = '';

      setTimeout(() => {
        messageSent.value = false;
      }, 3000);
    } catch (error) {
      name.value = '';
      email.value = '';
      reason.value = '';
      pole.value = '';
      toast.error(error.response.data.message, { autoClose: 3000, });
    }
  } catch (error) {
    console.error('Failed:', error);
  } finally {
    isLoading.value = false;
  }
}
//PV
const openPvModal = () => {
  showPvModal.value = true;
};

const closePvModal = () => {
  showPvModal.value = false;
  pdfPreviewUrl.value = null;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    pdfPreviewUrl.value = URL.createObjectURL(file);
    newPv.pv = file;
  } else {
    toast.error("Veuillez sélectionner un fichier PDF valide!", { autoClose: 3000, });
  }
};

const getPdfPreviewUrl = (file) => {
  const pvName = file.split('/').pop();
  return `${import.meta.env.VITE_API_URL}/api/picture/office-pv/${office._id}/${pvName}`;
};

const handlePvSubmit = async (event) => {
  event.preventDefault();
  if (newPv.name && newPv.description && newPv.pv) {
    try {
      isLoading.value = true;

      if (newPv.pv.type !== "application/pdf") {
        toast.error("Veuillez télécharger un fichier PDF valide!", { autoClose: 3000, });
        return;
      }

      const formData = new FormData();
      formData.append("pv", newPv.pv);

      const { data: { url } } = await uploadPvOffice(office._id, formData);

      newPv.pv = url;

      office.pvs.push({ ...newPv });

      await updateOffice(office._id, office);

      Object.assign(newPv, { name: "", description: "", pv: null });

      toast.success("PV ajouté avec succès!", { autoClose: 3000, });
      closePvModal();
    } catch (error) {
      console.error("Error during PV submission:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    toast.error("Veuillez remplir tous les champs avant de soumettre", { autoClose: 3000, });
  }
};

const deletePv = async (index) => {
  await confirm(
    "Etes-vous sûr de vouloir supprimer ce PV?",
    async () => {
      office.pvs.splice(index, 1);
      await updateOffice(office._id, office);
      toast.success("PV supprimé avec succès!", { autoClose: 3000, });
    }
  );
};
//event
const openEventModal = (event = null) => {
  if (event) {
    newEvent.value = {
      _id: event?._id ?? null,
      name: event?.name ?? "",
      description: event?.description ?? "",
      posters: event?.posters ?? [],
      startDate: event?.startDate ?? "",
      endDate: event?.endDate ?? "",
      location: event?.location ?? "",
      activities: event?.activities ?? [],
      ticket: {
        intern: event?.ticket?.intern ?? "",
        extern: event?.ticket?.extern ?? ""
      },
      collaborators: event?.collaborators ?? [],
      office: event?.office ?? currentId
    };
    isEditMode.value = true;
    imagePreviewUrls.value = event.posters.map(poster => {
      const pictureName = poster.split('/').pop();
      return `${import.meta.env.VITE_API_URL}/api/picture/office-images/${id}/${pictureName}`;
    });
  } else {
    newEvent.value = {
      _id: null,
      name: "",
      description: "",
      posters: [],
      startDate: "",
      endDate: "",
      location: "",
      activities: [],
      ticket: {
        intern: "",
        extern: ""
      },
      collaborators: [],
      office: currentId
    };
    isEditMode.value = false;
  }
  showEventModal.value = true;
};

const closeEventModal = () => {
  showEventModal.value = false;
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

const getCurrentIndex = (eventId: string): number => {
  return currentIndices.value[eventId] ?? 0;
};

const handleEventSubmit = async () => {
  if (newEvent.value) {
    try {
      isLoading.value = true;
      const formData = new FormData();
      newEvent.value.posters.forEach((poster, index) => {
        formData.append("picture", poster);
      });

      isLoading.value = true;
      const { data: { urls } } = await uploadOfficeImage(office._id, formData, { timeout: 600000  });

      newEvent.value.posters = urls;

      const eventCopy = { ...newEvent.value };
      await addEvent(eventCopy);

      Object.assign(newEvent.value, {
        name: "",
        description: "",
        poster: [],
        startDate: "",
        endDate: "",
        location: "",
        activities: [],
        ticket: {
          intern: "",
          extern: ""
        },
        collaborators: [],
        office: currentId
      });

      toast.success("Événement ajouté avec succès!", { autoClose: 3000, });
      closeEventModal();
      window.location.reload();
    } catch (error) {
      toast.error(`The title should be unique. Error: ${error}`, { autoClose: 3000, });
      console.error("Error during Event submission:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    toast.error("Veuillez remplir tous les champs avant de soumettre", { autoClose: 3000, });
  }
};

const deleteEventFunction = async (id) => {
  await confirm(
    "Etes-vous sûr de vouloir supprimer cet événement!?",
    async () => {
      try {
      isLoading.value = true;
      const res = await deleteEvent(id);
      if (res) {
        toast.success("Événement supprimé avec succès!", { autoClose: 3000, });
      } else {
        toast.error("Impossible de supprimer l'événement.", { autoClose: 3000, });
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Une erreur s'est produite lors de la suppression de l'événement", { autoClose: 3000, });
    } finally {
      isLoading.value = false;
    }
    }
  );
};

const updateEventFunction = async (id) => {
  if (newEvent.value) {
    try {
      isLoading.value = true;
      const formData = new FormData();

      const newFiles = newEvent.value.posters.filter(poster => poster instanceof File);
      newFiles.forEach((file) => {
        formData.append("picture", file);
      });

      if (newFiles.length > 0) {
        const { data: { urls } } = await uploadOfficeImage(office._id, formData, { timeout: 500000 });

        const existingUrls = newEvent.value.posters.filter(poster => typeof poster === 'string');

        newEvent.value.posters = [...existingUrls, ...urls];
      }
      newEvent.value.updateStatus = true;

      const eventCopy = { ...newEvent.value };

      await updateEvent(id, eventCopy);

      toast.success("L'événement a été mis à jour avec succès!", { autoClose: 3000, });
      closeEventModal();
      window.location.reload();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Une erreur s'est produite lors de la mise à jour de l'événement.", { autoClose: 3000, });
    } finally {
      isLoading.value = false;
    }
  }
};

const addCollaborator = () => {
  if (collaboratorName.value.trim()) {
    newEvent.value.collaborators.push(collaboratorName.value.trim());
    collaboratorName.value = "";
  }
};

const removeCollaborator = (index) => {
  newEvent.value.collaborators.splice(index, 1);
};

const addActivity = () => {
  if (activityName.value.trim()) {
    newEvent.value.activities.push(activityName.value.trim());
    activityName.value = "";
  }
};

const removeActivity = (index) => {
  newEvent.value.activities.splice(index, 1);
};

onMounted(() => {
  if (!imagePreviewUrls.value) {
    imagePreviewUrls.value = [];
  }
  if (!newEvent.value.posters) {
    newEvent.value.posters = [];
  }
});

const handleImageUpload = (event) => {
  const files = event.target.files;

  if (files && files.length) {

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        imagePreviewUrls.value.push(previewUrl);
        newEvent.value.posters.push(file);
      } else {
        toast.error("Veuillez sélectionner des fichiers d'image valides.", { autoClose: 3000, });
      }
    });
  }
};

const removeImage = (index) => {
  imagePreviewUrls.value.splice(index, 1);
};
//Post
const openPostModal = () => {
  showPostModal.value = true;
};

const closePostModal = () => {
  showPostModal.value = false;
};

const handlePostSubmit = async () => {
  toast.success("Message soumis!", { autoClose: 3000, });
  closePostModal();
};
//profile

const hasChanges = computed(() => {
  const hasChangesToSave = (profileFile.value || profilePreview.value) ||
                          (coverFile.value || coverPreview.value);
  return hasChangesToSave;
});

const triggerFileInput = (type) => {
  if (type === 'profile') {
    profileInput.value.click();
  } else {
    coverInput.value.click();
  }
};

const handleImageChange = (event, type) => {
  const file = event.target.files?.[0];
  if (file) {
    const preview = URL.createObjectURL(file);

    if (type === 'profile') {
      profileFile.value = file;
      profilePreview.value = preview;
    } else {
      coverFile.value = file;
      coverPreview.value = preview;
    }
  }
};

const cancelBtn = () => {
  profileFile.value = null;
  coverFile.value = null;
  profilePreview.value = '';
  coverPreview.value = '';
  return;
};

const saveChanges = async () => {
  try {
    isLoading.value = true;
    if (profileFile.value && profilePreview.value) {
      const formData = new FormData();
      formData.append('avatar', profileFile.value);
      const response = await uploadAvatar(office._id, formData);
      office.picture = response.imageUrl;
    }

    if (coverFile.value && coverPreview.value) {
      const formData = new FormData();
      formData.append('background', coverFile.value);
      const response = await uploadOfficeBackground(office._id, formData);
      office.backgroundPicture = response.imageUrl;
    }

    const officeCopy = JSON.parse(JSON.stringify(office));

    if (!profileFile.value) {
      delete officeCopy.picture;
    }

    if (!coverFile.value) {
      delete officeCopy.backgroundPicture;
    }

    const res = await updateOffice(office._id, officeCopy);

    const decodedToken = parseJwt(localStorage.getItem('token'));
    const updatedOffice = await getOffice(decodedToken.userId);

    localStorage.setItem('user', JSON.stringify(updatedOffice));

    profileFile.value = null;
    coverFile.value = null;
    profilePreview.value = '';
    coverPreview.value = '';
    toast.success("Bureau mis à jour avec succès!", { autoClose: 3000, });
    window.location.reload();
  } catch (error) {
    console.error('Error updating office:', error);
    toast.error("Impossible de mettre à jour le bureau. Veuillez réessayer.", { autoClose: 3000, });
  } finally {
    isLoading.value = false;
  }
};

const saveProfile = async () => {
  try {
    isLoading.value = true;
    const officeCopy = ({
      name: office.name,
      abb: office.abb,
      email: office.email,
      slogan: office.slogan,
      description: office.description
    });

    await updateOffice(office._id, officeCopy);

    const decodedToken = parseJwt(localStorage.getItem('token'));
    const updatedOffice = await getOffice(decodedToken.userId);

    // if (updatedOffice.data.picture) {
    //   const pictureName = updatedOffice.data.picture.split('/').pop();
    //   updatedOffice.data.picture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${updatedOffice.data._id}/${pictureName}`;
    // }

    // if (updatedOffice.data.backgroundPicture) {
    //   const pictureName = updatedOffice.data.backgroundPicture.split('/').pop();
    //   updatedOffice.data.backgroundPicture = `${import.meta.env.VITE_API_URL}/api/picture/avatar/${updatedOffice.data._id}/${pictureName}`;
    // }

    localStorage.setItem('user', JSON.stringify(updatedOffice));

    isEditing.value = false;
    toast.success("Bureau mis à jour avec succès!", { autoClose: 3000, });
    window.location.reload();
  } catch (error) {
    console.error('Error updating office:', error);
    toast.error("Impossible de mettre à jour le bureau. Veuillez réessayer", { autoClose: 3000, });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import './offices.css';
</style>
