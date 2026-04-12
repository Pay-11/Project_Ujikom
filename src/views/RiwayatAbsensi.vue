<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Riwayat Absensi</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <!-- Stats Cards -->
      <div class="stats-wrapper">
        <div class="stat-card hadir">
          <div class="stat-icon">
            <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
          </div>
          <div class="stat-info">
            <h4>12</h4>
            <p>Hadir</p>
          </div>
        </div>
        <div class="stat-card sakit">
          <div class="stat-icon">
            <ion-icon :icon="medkitOutline"></ion-icon>
          </div>
          <div class="stat-info">
            <h4>1</h4>
            <p>Sakit</p>
          </div>
        </div>
        <div class="stat-card izin">
          <div class="stat-icon">
            <ion-icon :icon="documentTextOutline"></ion-icon>
          </div>
          <div class="stat-info">
            <h4>1</h4>
            <p>Izin</p>
          </div>
        </div>
        <div class="stat-card alfa">
          <div class="stat-icon">
            <ion-icon :icon="closeCircleOutline"></ion-icon>
          </div>
          <div class="stat-info">
            <h4>0</h4>
            <p>Alfa</p>
          </div>
        </div>
      </div>

      <!-- History List -->
      <div class="history-container">
        <div class="history-header">
          <h3>Minggu Terakhir</h3>
          <span class="filter">Filter <ion-icon :icon="filterOutline"></ion-icon></span>
        </div>

        <div class="history-list">
          <div 
            v-for="(item, idx) in historyData" 
            :key="idx"
            class="history-item"
          >
            <div class="date-col">
              <span class="day">{{ item.day }}</span>
              <span class="date">{{ item.date }}</span>
            </div>

            <div class="detail-col">
              <div class="subject-info">
                <h4>{{ item.subject }}</h4>
                <p><ion-icon :icon="timeOutline"></ion-icon> {{ item.time }}</p>
              </div>
              <div class="status-badge" :class="item.status.toLowerCase()">
                {{ item.status }}
              </div>
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
  checkmarkCircleOutline, medkitOutline, closeCircleOutline, 
  filterOutline, timeOutline, documentTextOutline
} from 'ionicons/icons'

// Dummy Data
const historyData = [
  { day: 'Jum', date: '25 Okt', subject: 'Matematika Peminatan', time: '08:00 WIB', status: 'Hadir' },
  { day: 'Kam', date: '24 Okt', subject: 'Seni Budaya', time: '07:10 WIB', status: 'Hadir' },
  { day: 'Kam', date: '24 Okt', subject: 'Produk Kreatif', time: '10:35 WIB', status: 'Hadir' },
  { day: 'Rab', date: '23 Okt', subject: 'Pemrograman Mobile', time: '10:30 WIB', status: 'Izin' },
  { day: 'Rab', date: '23 Okt', subject: 'Bahasa Inggris', time: '07:05 WIB', status: 'Hadir' },
  { day: 'Sel', date: '22 Okt', subject: 'Basis Data', time: '08:35 WIB', status: 'Hadir' },
  { day: 'Sel', date: '22 Okt', subject: 'Bahasa Indonesia', time: '07:15 WIB', status: 'Sakit' },
  { day: 'Sen', date: '21 Okt', subject: 'Pemrograman Web', time: '10:05 WIB', status: 'Hadir' },
  { day: 'Sen', date: '21 Okt', subject: 'Matematika', time: '08:00 WIB', status: 'Hadir' },
]
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
  height: 150px;
  background: #e53935;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 0;
}

.stats-wrapper {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  gap: 8px;
  margin-top: 10px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  transition: transform 0.2s;
}

.stat-card:active {
  transform: scale(0.95);
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-bottom: 8px;
}

.stat-card.hadir .stat-icon { background: #d1fae5; color: #10b981; }
.stat-card.sakit .stat-icon { background: #fef3c7; color: #f59e0b; }
.stat-card.izin .stat-icon { background: #dbeafe; color: #3b82f6; }
.stat-card.alfa .stat-icon { background: #fee2e2; color: #ef4444; }

.stat-info {
  text-align: center;
}

.stat-info h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
}

.stat-info p {
  margin: 4px 0 0;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
}

.history-container {
  padding: 20px 16px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.filter {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #e53935;
  font-weight: 600;
  background: #fdecea;
  padding: 6px 12px;
  border-radius: 100px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.date-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 65px;
  border-right: 1px dashed #e5e7eb;
  padding-right: 16px;
  margin-right: 16px;
}

.date-col .day {
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
}

.date-col .date {
  font-size: 16px;
  font-weight: 800;
  color: #e53935;
  margin-top: 4px;
}

.detail-col {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subject-info h4 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.subject-info p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
}

.status-badge.hadir { background: #d1fae5; color: #10b981; }
.status-badge.izin { background: #dbeafe; color: #3b82f6; }
.status-badge.sakit { background: #fef3c7; color: #f59e0b; }
.status-badge.alfa { background: #fee2e2; color: #ef4444; }
</style>
