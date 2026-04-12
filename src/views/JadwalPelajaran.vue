<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Jadwal Pelajaran</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <!-- Days Filter -->
      <div class="filter-wrapper">
        <div class="days-scroll">
          <div 
            v-for="(day, index) in days" 
            :key="index"
            class="day-chip"
            :class="{ active: selectedDay === day }"
            @click="selectedDay = day"
          >
            {{ day }}
          </div>
        </div>
      </div>

      <!-- Schedule Content -->
      <div class="schedule-container">
        <h2 class="sub-title">Jadwal Kelas XII RPL 2</h2>
        
        <div class="timeline">
          <!-- Item loop -->
          <div 
            class="timeline-item" 
            v-for="(subject, idx) in currentSchedule" 
            :key="idx"
          >
            <div class="time-column">
              <span class="start-time">{{ subject.start }}</span>
              <span class="end-time">{{ subject.end }}</span>
            </div>
            
            <div class="card-column">
              <div class="subject-card" :class="'color-' + (idx % 4)">
                <div class="card-header">
                  <h3 class="subject-name">{{ subject.name }}</h3>
                  <ion-icon :icon="bookOutline" class="subject-icon"></ion-icon>
                </div>
                <div class="card-body">
                  <div class="teacher-info">
                    <ion-avatar class="teacher-avatar">
                      <img :src="'https://ui-avatars.com/api/?name=' + subject.teacher + '&background=random'" />
                    </ion-avatar>
                    <span class="teacher-name">{{ subject.teacher }}</span>
                  </div>
                  <div class="room-info">
                    <ion-icon :icon="locationOutline"></ion-icon>
                    <span>Ruang {{ subject.room }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="currentSchedule.length === 0" class="empty-state">
            <ion-icon :icon="calendarClearOutline"></ion-icon>
            <p>Tidak ada jadwal pelajaran untuk hari ini.</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonContent, IonIcon, IonAvatar
} from '@ionic/vue'
import { bookOutline, locationOutline, calendarClearOutline } from 'ionicons/icons'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
const selectedDay = ref('Senin')

// Dummy data for schedule
const scheduleData = {
  'Senin': [
    { name: 'Upacara Bendera', start: '07:00', end: '08:00', teacher: 'Semua Guru', room: 'Lapangan' },
    { name: 'Matematika', start: '08:00', end: '10:00', teacher: 'Budi Santoso', room: '201' },
    { name: 'Istirahat', start: '10:00', end: '10:30', teacher: '-', room: 'Kantin' },
    { name: 'Pemrograman Web', start: '10:30', end: '13:00', teacher: 'Rina Wijaya', room: 'Lab Komputer 1' },
    { name: 'Istirahat / Ishoma', start: '13:00', end: '13:30', teacher: '-', room: 'Masjid/Kantin' },
    { name: 'Pendidikan Agama', start: '13:30', end: '15:30', teacher: 'Ahmad Fauzi', room: '201' },
  ],
  'Selasa': [
    { name: 'Bahasa Indonesia', start: '07:00', end: '09:00', teacher: 'Siti Aminah', room: '201' },
    { name: 'Basis Data', start: '09:00', end: '11:00', teacher: 'Hendra Saputra', room: 'Lab Komputer 2' },
    { name: 'Istirahat / Ishoma', start: '11:00', end: '12:00', teacher: '-', room: 'Kantin' },
    { name: 'PBO (Java)', start: '12:00', end: '15:30', teacher: 'Herman Malik', room: 'Lab Komputer 2' },
  ],
  'Rabu': [
    { name: 'Bahasa Inggris', start: '07:00', end: '09:00', teacher: 'Mrs. Ani', room: '201' },
    { name: 'Sejarah Indonesia', start: '09:00', end: '11:00', teacher: 'Drs. Supriadi', room: '201' },
    { name: 'Istirahat / Ishoma', start: '11:00', end: '12:00', teacher: '-', room: 'Kantin' },
    { name: 'Pemrograman Mobile', start: '12:00', end: '15:30', teacher: 'Reza Rahadian', room: 'Lab Komputer 3' },
  ],
  'Kamis': [
    { name: 'Seni Budaya', start: '07:00', end: '09:00', teacher: 'Nia Ramadhani', room: 'Ruang Kesenian' },
    { name: 'Penjasorkes', start: '09:00', end: '11:00', teacher: 'Junaidi, S.Pd', room: 'Lapangan Bola' },
    { name: 'Istirahat / Ishoma', start: '11:00', end: '12:00', teacher: '-', room: 'Kantin' },
    { name: 'Produk Kreatif & KWU', start: '12:00', end: '15:30', teacher: 'Dina Mariana', room: '201' },
  ],
  'Jumat': [
    { name: 'Senam Pagi / Rohis', start: '07:00', end: '08:00', teacher: 'Tim Guru', room: 'Lapangan / Masjid' },
    { name: 'Matematika Peminatan', start: '08:00', end: '09:30', teacher: 'Budi Santoso', room: '201' },
    { name: 'Istirahat', start: '09:30', end: '10:00', teacher: '-', room: 'Kantin' },
    { name: 'UI/UX Design', start: '10:00', end: '11:30', teacher: 'Arif Budi', room: 'Lab Multimedia' },
    { name: 'Shalat Jumat / Keputrian', start: '11:30', end: '13:00', teacher: '-', room: 'Masjid/Aula' },
    { name: 'Bimbingan Konseling', start: '13:00', end: '15:30', teacher: 'Dra. Yuli', room: '201' },
  ]
}

const currentSchedule = computed(() => {
  return scheduleData[selectedDay.value] || []
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
  height: 70px;
  background: #e53935;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 0;
}

.filter-wrapper {
  position: relative;
  z-index: 10;
  padding: 10px 0;
  margin-top: 10px;
}

.days-scroll {
  display: flex;
  overflow-x: auto;
  padding: 0 20px;
  gap: 12px;
  scrollbar-width: none; /* Firefox */
}
.days-scroll::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.day-chip {
  padding: 10px 24px;
  background: white;
  color: #6b7280;
  border-radius: 100px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid #f3f4f6;
}

.day-chip.active {
  background: #e53935;
  color: white;
  box-shadow: 0 8px 16px rgba(229, 57, 53, 0.3);
  transform: translateY(-2px);
  border-color: #e53935;
}

.schedule-container {
  position: relative;
  z-index: 5;
  padding: 24px 20px;
}

.sub-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
  margin-top: 0;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  min-height: 100px;
}

.time-column {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 4px;
  position: relative;
}

.time-column::after {
  content: '';
  position: absolute;
  top: 10px;
  right: -24px;
  width: 12px;
  height: 12px;
  background: #e53935;
  border-radius: 50%;
  border: 3px solid #fdecea;
  z-index: 2;
}

.time-column::before {
  content: '';
  position: absolute;
  top: 20px;
  right: -19px;
  width: 2px;
  height: calc(100% + 20px);
  background: #e5e7eb;
  z-index: 1;
}

.timeline-item:last-child .time-column::before {
  display: none;
}

.start-time {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.end-time {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  margin-top: 4px;
}

.card-column {
  flex: 1;
  padding-left: 14px; /* Space for the timeline dot */
}

.subject-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
}

.subject-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}

.color-0::before { background: #e53935; }
.color-1::before { background: #3b82f6; }
.color-2::before { background: #10b981; }
.color-3::before { background: #f59e0b; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.subject-name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.subject-icon {
  font-size: 20px;
  color: #9ca3af;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.teacher-info, .room-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.teacher-avatar {
  width: 24px;
  height: 24px;
}

.teacher-name, .room-info span {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.room-info ion-icon {
  font-size: 16px;
  color: #9ca3af;
  margin-left: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.empty-state ion-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state p {
  font-size: 15px;
  margin: 0;
}
</style>
