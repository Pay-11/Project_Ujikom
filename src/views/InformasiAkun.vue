<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/guru/profile" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Informasi Akun</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <div class="info-container">
        <!-- Profile Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img :src="`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=e53935&color=fff&size=120`" alt="Profile" />
          </div>
          <h2 class="user-name">{{ user?.name || 'Nama Guru' }}</h2>
          <p class="user-role">{{ user?.role || 'Guru' }}</p>
        </div>

        <!-- Detail Information Card -->
        <div class="info-card">
          <h3 class="card-title">Detail Personal</h3>
          
          <div class="info-item">
            <div class="info-icon">
              <ion-icon :icon="personOutline"></ion-icon>
            </div>
            <div class="info-text">
              <span class="label">Nama Lengkap</span>
              <span class="value">{{ user?.name || '-' }}</span>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <ion-icon :icon="mailOutline"></ion-icon>
            </div>
            <div class="info-text">
              <span class="label">Email</span>
              <span class="value">{{ user?.email || '-' }}</span>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <ion-icon :icon="cardOutline"></ion-icon>
            </div>
            <div class="info-text">
              <span class="label">NIP / NUPTK</span>
              <span class="value">{{ user?.nip || '-' }}</span>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">
              <ion-icon :icon="callOutline"></ion-icon>
            </div>
            <div class="info-text">
              <span class="label">No. Telepon</span>
              <span class="value">{{ user?.phone || '-' }}</span>
            </div>
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
  personOutline, mailOutline, cardOutline, callOutline
} from 'ionicons/icons'
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const user = ref(null)

const getProfile = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  getProfile()
})
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
  height: 120px;
  background: #e53935;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  z-index: 0;
}

.info-container {
  position: relative;
  z-index: 10;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  padding: 4px;
  box-shadow: 0 8px 16px rgba(229, 57, 53, 0.2);
  margin-bottom: 16px;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.user-role {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 100px;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.card-title {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-item:first-of-type {
  padding-top: 0;
}

.info-icon {
  width: 40px;
  height: 40px;
  background: #fdecea;
  color: #e53935;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  flex-shrink: 0;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}
</style>
