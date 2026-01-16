# School Communication & Clubs Management System - Frontend

This is the **frontend** Vue.js application for the school communication platform.

> **Important**: You need to run the backend first. Get it here:
> 
> **[Backend Repository](https://github.com/raghadisraghad/school-club-management-backend.git)**

---

## 🚀 Quick Setup

1. **Clone this repo:**
   ```bash
   git clone https://github.com/raghadisraghad/school-club-management.git
   cd school-club-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

---

## ✨ Key Features

### 🏢 Office/Club Management
- Request to create new offices (admin approval needed)
- Browse all approved offices with images and details
- Join offices with president approval

### 📢 Content System
- View approved events, posts, and announcements
- Office presidents create content (admin approval required)
- Rich media support (images, etc.)

### 👑 Admin Dashboard
- Approve/reject office creation requests
- Approve/reject all content before publishing
- Manage all users and offices

### 👥 User Features
- Student registration
- Request to join offices
- Browse approved content feed
- Role-based interfaces

---

## ⚙️ Tech Stack
- Vue.js 3
- Vuex for state management
- Vuetify for UI components
- Axios for API calls

---

## 🌐 Connect to Backend
update .env of both front and backend in order to sync the communication between them
