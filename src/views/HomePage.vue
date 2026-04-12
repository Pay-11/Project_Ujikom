<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <div class="user-greeting">
          <div class="avatar-box" @click="goTo('/profile')">
            <img src="https://ui-avatars.com/api/?name=Egiluy&background=fff&color=e53935" alt="Avatar"/>
          </div>
          <div class="greeting-text">
            <h2>Hai, EGILUY 👋</h2>
            <p>XII RPL 2 • NISN 0041234567</p>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <!-- ABSENSI HARI INI HERO -->
      <div class="hero-card">
        <div class="hero-header">
          <h3>Absensi Saat Ini</h3>
          <span class="live-badge">Sedang Berlangsung</span>
        </div>
        
        <div class="hero-body">
          <div class="subject-main">
            <h2>Bahasa Indonesia</h2>
            <p><ion-icon :icon="timeOutline"></ion-icon> 09:30 - 11:50 WIB</p>
          </div>
        </div>
      </div>

      <!-- MAIN MENU (Grid) -->
      <div class="menu-container">
        <h4 class="section-title">Menu Utama</h4>
        <div class="menu-grid">
          
          <div class="menu-item" @click="goTo('/jadwal-pelajaran')">
            <div class="icon-wrapper color-red">
              <ion-icon :icon="calendarOutline"></ion-icon>
            </div>
            <span>Jadwal<br>Pelajaran</span>
          </div>

          <div class="menu-item" @click="goTo('/jadwal-piket')">
            <div class="icon-wrapper color-orange">
              <ion-icon :icon="brushOutline"></ion-icon>
            </div>
            <span>Jadwal<br>Piket</span>
          </div>

          <div class="menu-item" @click="goTo('/riwayat-absensi')">
            <div class="icon-wrapper color-green">
              <ion-icon :icon="timeOutline"></ion-icon>
            </div>
            <span>Riwayat<br>Absensi</span>
          </div>

          <div class="menu-item" @click="goTo('/nilai-sikap-siswa')">
            <div class="icon-wrapper color-purple">
              <ion-icon :icon="starOutline"></ion-icon>
            </div>
            <span>Nilai<br>Sikap</span>
          </div>

        </div>
      </div>

      <!-- DAFTAR MATA PELAJARAN (SISA HARI INI) -->
      <div class="schedule-list">
        <div class="section-header">
          <h4 class="section-title">Pelajaran Hari Ini</h4>
          <span class="view-all" @click="goTo('/jadwal-pelajaran')">Lihat Semua</span>
        </div>

        <div class="subject-item done">
          <div class="subject-icon"><ion-icon :icon="checkmarkCircleOutline"></ion-icon></div>
          <div class="subject-info">
            <h4>B. Inggris</h4>
            <p>Selesai • 07:15 - 08:45</p>
          </div>
        </div>

        <div class="subject-item active">
          <div class="subject-icon"><ion-icon :icon="bookOutline"></ion-icon></div>
          <div class="subject-info">
            <h4>B. Indonesia</h4>
            <p>Sedang Berlangsung • 09:30 - 11:50</p>
          </div>
        </div>

        <div class="subject-item pending">
          <div class="subject-icon"><ion-icon :icon="lockClosedOutline"></ion-icon></div>
          <div class="subject-info">
            <h4>Matematika</h4>
            <p>Menunggu • 13:00 - 15:00</p>
          </div>
        </div>

      </div>

    </ion-content>

    <!-- BOTTOM NAV -->
    <ion-footer class="ion-no-border">
      <div class="bottom-nav">
        <div class="nav-item active">
          <ion-icon :icon="home"></ion-icon>
          <span>Beranda</span>
        </div>
        <div class="nav-item fab-wrapper" @click="goTo('/scan')">
          <div class="nav-fab">
            <ion-icon :icon="scanOutline"></ion-icon>
          </div>
        </div>
        <div class="nav-item" @click="goTo('/profile')">
          <ion-icon :icon="personOutline"></ion-icon>
          <span>Profil</span>
        </div>
      </div>
    </ion-footer>

  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonIcon
} from '@ionic/vue'
import {
  timeOutline, qrCodeOutline, calendarOutline, 
  brushOutline, documentTextOutline, bookOutline, lockClosedOutline,
  checkmarkCircleOutline, home, personOutline, scanOutline, starOutline
} from 'ionicons/icons'

import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.custom-header {
  --background: #e53935;
  padding: 10px 0;
}

.bg-light {
  --background: #f4f7f6;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: #e53935;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  z-index: 0;
}

.user-greeting {
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 15px;
}

.avatar-box {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255,255,255,0.8);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: pointer;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.greeting-text {
  flex: 1;
}

.greeting-text h2 {
  margin: 0 0 2px;
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.greeting-text p {
  margin: 0;
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

.notif-icon {
  font-size: 26px;
  color: white;
  padding: 8px;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
}

/* Hero Section */
.hero-card {
  background: white;
  margin: 20px 20px;
  border-radius: 20px;
  padding: 24px;
  position: relative;
  z-index: 10;
  box-shadow: 0 10px 30px rgba(229, 57, 53, 0.15);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hero-header h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.live-badge {
  background: #fee2e2;
  color: #e53935;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 100px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.hero-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subject-main h2 {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 800;
  color: #1f2937;
}

.subject-main p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 5px;
}

.hero-scan-btn {
  background: #e53935;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 8px 20px rgba(229, 57, 53, 0.3);
  cursor: pointer;
  transition: transform 0.2s;
}

.hero-scan-btn:active {
  transform: scale(0.95);
}

.hero-scan-btn ion-icon {
  font-size: 28px;
}

.hero-scan-btn span {
  font-size: 12px;
  font-weight: 700;
}

/* Sections */
.section-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
  padding: 0 20px;
}

/* Menus */
.menu-container {
  margin-bottom: 30px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px; /* Sedikit dilonggarkan karena ruang lebih luas */
  padding: 0 20px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  margin-bottom: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  background: white;
}

.color-red { color: #e53935; }
.color-orange { color: #f59e0b; }
.color-green { color: #10b981; }
.color-gray { color: #6b7280; }
.color-purple { color: #8b5cf6; }

.menu-item span {
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  line-height: 1.3;
}

/* Schedule List */
.schedule-list {
  padding: 0 20px 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header .section-title {
  padding: 0;
  margin: 0;
}

.view-all {
  font-size: 13px;
  font-weight: 700;
  color: #e53935;
  cursor: pointer;
}

.subject-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}

.subject-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.subject-info h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.subject-info p {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
}

.subject-item.done .subject-icon { background: #d1fae5; color: #10b981; }
.subject-item.done .subject-info p { color: #10b981; }

.subject-item.active { border-left: 4px solid #e53935; }
.subject-item.active .subject-icon { background: #fee2e2; color: #e53935; }
.subject-item.active .subject-info p { color: #e53935; }

.subject-item.pending .subject-icon { background: #f3f4f6; color: #9ca3af; }
.subject-item.pending .subject-info p { color: #9ca3af; }

/* Bottom Navbar */
.bottom-nav {
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 65px;
  padding-bottom: 10px;
  box-shadow: 0 -10px 20px rgba(0,0,0,0.03);
  position: relative;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  flex: 1;
  gap: 4px;
  cursor: pointer;
}

.nav-item ion-icon {
  font-size: 24px;
  transition: all 0.3s;
}

.nav-item.active {
  color: #e53935;
}

.nav-item.active ion-icon {
  transform: translateY(-2px);
}

.fab-wrapper {
  position: relative;
  top: -20px;
}

.nav-fab {
  width: 56px;
  height: 56px;
  background: #e53935;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
  box-shadow: 0 8px 20px rgba(229, 57, 53, 0.4);
  border: 4px solid #f4f7f6;
  margin-bottom: 2px;
}
</style>
