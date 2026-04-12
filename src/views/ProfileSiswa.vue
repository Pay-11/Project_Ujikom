<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Profil Siswa</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar-container">
          <img src="https://ui-avatars.com/api/?name=Egiluy&background=fff&color=e53935&size=150" alt="Avatar"/>
          <button class="edit-avatar">
            <ion-icon :icon="cameraOutline"></ion-icon>
          </button>
        </div>
        
        <h2 class="student-name">EGILUY</h2>
        <p class="student-class">Kelas XII RPL 2</p>
        <span class="student-nisn">NISN: 0041234567</span>
      </div>

      <!-- Action Cards -->
      <div class="action-list">
        <div class="action-item" @click="openMenu('data')">
          <div class="action-icon">
            <ion-icon :icon="personOutline"></ion-icon>
          </div>
          <div class="action-text">
            <h4>Data Diri</h4>
            <p>Informasi pribadi & orang tua</p>
          </div>
          <ion-icon :icon="chevronForwardOutline" class="go-icon"></ion-icon>
        </div>

        <div class="action-item" @click="openMenu('security')">
          <div class="action-icon">
            <ion-icon :icon="lockClosedOutline"></ion-icon>
          </div>
          <div class="action-text">
            <h4>Keamanan Akun</h4>
            <p>Ganti kata sandi</p>
          </div>
          <ion-icon :icon="chevronForwardOutline" class="go-icon"></ion-icon>
        </div>

        <div class="action-item" @click="openMenu('about')">
          <div class="action-icon">
            <ion-icon :icon="informationCircleOutline"></ion-icon>
          </div>
          <div class="action-text">
            <h4>Tentang Sehadir</h4>
            <p>Versi aplikasi 1.0.0</p>
          </div>
          <ion-icon :icon="chevronForwardOutline" class="go-icon"></ion-icon>
        </div>
        
        <div class="action-item logout" @click="handleLogout">
          <div class="action-icon logout-icon">
            <ion-icon :icon="logOutOutline"></ion-icon>
          </div>
          <div class="action-text">
            <h4>Keluar</h4>
            <p>Akhiri sesi Anda</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonContent, IonIcon
} from '@ionic/vue'
import { 
  cameraOutline, personOutline, lockClosedOutline, 
  informationCircleOutline, logOutOutline, chevronForwardOutline 
} from 'ionicons/icons'
import { useRouter } from 'vue-router'

const router = useRouter()

const openMenu = (type) => {
  console.log('Membuka menu', type)
  // Logic untuk pindah route atau menampilkan modal
}

const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.custom-header {
  --background: #e53935;
  color: white;
}

.bg-light {
  --background: #f4f7f6;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 140px;
  background: #e53935;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  z-index: 0;
}

.profile-header {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  margin-bottom: 30px;
}

.avatar-container {
  position: relative;
  width: 110px;
  height: 110px;
  margin-bottom: 20px;
}

.avatar-container img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  object-fit: cover;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  color: #e53935;
  font-size: 20px;
  cursor: pointer;
}

.student-name {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 800;
  color: #1f2937;
}

.student-class {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  color: #e53935;
}

.student-nisn {
  background: #f3f4f6;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.5px;
}

.action-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-item {
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  transition: transform 0.2s;
}

.action-item:active {
  transform: scale(0.98);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: #fdecea;
  color: #e53935;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.action-text {
  flex: 1;
}

.action-text h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.action-text p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.go-icon {
  color: #9ca3af;
  font-size: 20px;
}

.logout {
  margin-top: 10px;
  border: 1px solid #fee2e2;
}

.logout-icon {
  background: #fee2e2;
  color: #dc2626;
}

.logout h4 {
  color: #dc2626;
}
</style>
