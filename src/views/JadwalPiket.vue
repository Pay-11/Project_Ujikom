<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" color="light"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="toggleEditMode" class="header-btn">
            {{ isEditing ? 'Selesai' : 'Edit' }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <div class="content-wrapper">
        <div class="info-card">
          <ion-icon :icon="sparklesOutline" class="info-icon"></ion-icon>
          <div>
            <h3>Tetap Jaga Kebersihan</h3>
            <p>Kelas yang bersih mencerminkan siswa yang disiplin.</p>
          </div>
        </div>

        <div class="schedule-grid">
          <div 
            v-for="(day, idx) in days" 
            :key="idx"
            class="day-card"
          >
            <div class="day-header" :class="'color-' + (idx % 3)">
              <h4>{{ day }}</h4>
              <ion-icon :icon="calendarOutline"></ion-icon>
            </div>
            
            <div class="student-list" v-if="piketData[day]">
              <div 
                v-for="(student, sIdx) in piketData[day]" 
                :key="sIdx"
                class="student-item"
              >
                <ion-avatar class="student-avatar" v-if="!isEditing">
                  <img :src="'https://ui-avatars.com/api/?name=' + student + '&background=random&color=fff'" />
                </ion-avatar>
                
                <div class="student-info" v-if="!isEditing">
                  <span class="student-name">{{ student }}</span>
                  <span class="student-role">{{ sIdx === 0 ? 'Ketua Piket' : 'Anggota' }}</span>
                </div>

                <!-- Mode Edit -->
                <div class="edit-input-wrapper" v-if="isEditing">
                  <input 
                    type="text" 
                    v-model="piketData[day][sIdx]" 
                    class="edit-input"
                    placeholder="Nama siswa"
                  />
                  <button @click="removeStudent(day, sIdx)" class="remove-btn">
                    <ion-icon :icon="closeCircleOutline"></ion-icon>
                  </button>
                </div>
              </div>

              <!-- Tombol Tambah Anggota saat edit mode -->
              <div v-if="isEditing" class="add-btn-wrapper">
                <button @click="addStudent(day)" class="add-btn">
                  <ion-icon :icon="addCircleOutline"></ion-icon>
                  <span>Tambah Anggota</span>
                </button>
              </div>
            </div>
            
            <div v-else class="empty-list">
              <p>Libur Piket</p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonButton, IonTitle, IonContent, IonIcon, IonAvatar
} from '@ionic/vue'
import { 
  sparklesOutline, calendarOutline, closeCircleOutline, addCircleOutline 
} from 'ionicons/icons'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']

const piketData = reactive({
  'Senin': ['Egiluy', 'Ahmad Dani', 'Budi Santoso', 'Cici Pertiwi'],
  'Selasa': ['Deni Mubarok', 'Dini Astuti', 'Eka Putra', 'Rina Wijaya'],
  'Rabu': ['Fajar Sidik', 'Siti Aminah', 'Hendra Saputra', 'Irwan Sanusi'],
  'Kamis': ['Joko Widodo', 'Kartika Sari', 'Lukman Hakim', 'Mia Amelia'],
  'Jumat': ['Nando Suherman', 'Oki Setiana', 'Putri Ayu', 'Rizky Febian']
})

const isEditing = ref(false)

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
}

const addStudent = (day) => {
  if (!piketData[day]) {
    piketData[day] = []
  }
  piketData[day].push('')
}

const removeStudent = (day, index) => {
  piketData[day].splice(index, 1)
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

.header-btn {
  --color: white;
  font-weight: 600;
  font-size: 14px;
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
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  padding: 20px 16px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}

.info-icon {
  font-size: 36px;
  color: #f59e0b;
  flex-shrink: 0;
}

.info-card h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.info-card p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.schedule-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.day-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}

.day-header {
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-header.color-0 { background: #fee2e2; color: #e53935; } /* Red */
.day-header.color-1 { background: #dbeafe; color: #2563eb; } /* Blue */
.day-header.color-2 { background: #d1fae5; color: #10b981; } /* Green */

.day-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.day-header ion-icon {
  font-size: 20px;
}

.student-list {
  padding: 12px 20px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.student-item:last-child {
  border-bottom: none;
}

.student-avatar {
  width: 40px;
  height: 40px;
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.student-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.student-role {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.empty-list {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
}

/* Edit Mode Styles */
.edit-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.edit-input {
  flex: 1;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  background: #f9fafb;
  color: #1f2937;
}

.edit-input:focus {
  outline: none;
  border-color: #e53935;
  background: white;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.add-btn-wrapper {
  padding-top: 10px;
  display: flex;
  justify-content: center;
}

.add-btn {
  background: #fdecea;
  color: #e53935;
  border: 1px dashed #fca5a5;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: center;
  cursor: pointer;
}
</style>
