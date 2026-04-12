<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/guru" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Absensi Manual</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <div class="content-wrapper">
        <div class="info-card">
          <ion-icon :icon="createOutline" class="info-icon"></ion-icon>
          <div>
            <h3>Input Absensi Manual</h3>
            <p>Masukkan keterangan Sakit, Izin, atau Alfa untuk siswa yang tidak dapat hadir.</p>
          </div>
        </div>

        <div class="form-card">
          <!-- Pilih Kelas -->
          <div class="form-group">
            <label>Pilih Kelas</label>
            <select class="custom-input" v-model="form.kelas">
              <option disabled value="">Pilih salah satu kelas...</option>
              <option value="XII RPL 2">XII RPL 2</option>
              <option value="XI PPLG 2">XI PPLG 2</option>
              <option value="X AKL">X AKL</option>
            </select>
          </div>

          <!-- Pilih Siswa -->
          <div class="form-group">
            <label>Nama Siswa</label>
            <select class="custom-input" v-model="form.siswa">
              <option disabled value="">Pilih nama siswa...</option>
              <option v-for="(siswa, idx) in dummyStudents" :key="idx" :value="siswa">
                {{ siswa }}
              </option>
            </select>
          </div>

          <!-- Keterangan Absensi -->
          <div class="form-group">
            <label>Keterangan</label>
            <div class="radio-group">
              <label class="radio-label" :class="{ 'active': form.status === 'Sakit' }">
                <input type="radio" v-model="form.status" value="Sakit">
                <span>Sakit</span>
              </label>
              
              <label class="radio-label" :class="{ 'active': form.status === 'Izin' }">
                <input type="radio" v-model="form.status" value="Izin">
                <span>Izin</span>
              </label>
              
              <label class="radio-label" :class="{ 'active': form.status === 'Alfa' }">
                <input type="radio" v-model="form.status" value="Alfa">
                <span>Alfa</span>
              </label>
            </div>
          </div>

          <!-- Catatan / Bukti -->
          <div class="form-group">
            <label>Catatan / Alasan (Opsional)</label>
            <textarea 
              class="custom-textarea" 
              v-model="form.catatan" 
              placeholder="Contoh: Surat dokter menyusul / Acara keluarga"
              rows="3"
            ></textarea>
          </div>

          <button class="submit-btn" @click="submitAbsensi" :disabled="!isFormValid">
            <ion-icon :icon="saveOutline"></ion-icon>
            <span>Simpan Absensi</span>
          </button>
        </div>
      </div>

      <!-- Toast Notifikasi Sukses -->
      <ion-toast
        :is-open="showToast"
        message="Data absensi manual berhasil disimpan."
        :duration="2500"
        @didDismiss="showToast = false"
        position="top"
        color="success"
      ></ion-toast>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonContent, IonIcon, IonToast
} from '@ionic/vue'
import { createOutline, saveOutline } from 'ionicons/icons'

const dummyStudents = [
  'Ahmad Dani', 'Budi Santoso', 'Cici Pertiwi', 'Deni Mubarok', 'Egiluy'
]

const form = ref({
  kelas: '',
  siswa: '',
  status: '',
  catatan: ''
})

const showToast = ref(false)

const isFormValid = computed(() => {
  return form.value.kelas !== '' && form.value.siswa !== '' && form.value.status !== ''
})

const submitAbsensi = () => {
  if (isFormValid.value) {
    // Di sini logika untuk kirim data ke backend post absensi
    console.log("Menyimpan Absensi:", form.value)
    
    // Tampilkan notifikasi
    showToast.value = true
    
    // Reset form
    form.value = {
      kelas: '',
      siswa: '',
      status: '',
      catatan: ''
    }
  }
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
  height: 120px;
  background: #e53935;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  padding: 20px;
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

.form-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
}

.custom-input, .custom-textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  color: #1f2937;
  background: #f9fafb;
  outline: none;
  transition: all 0.2s;
}

.custom-input:focus, .custom-textarea:focus {
  border-color: #e53935;
  background: white;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
}

.custom-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Radio Button Styling */
.radio-group {
  display: flex;
  gap: 10px;
}

.radio-label {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.radio-label input {
  display: none;
}

.radio-label.active {
  border-color: #e53935;
  background: #fdecea;
  color: #e53935;
}

.submit-btn {
  width: 100%;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(229, 57, 53, 0.25);
  transition: transform 0.2s, opacity 0.2s;
}

.submit-btn:disabled {
  background: #d1d5db;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.7;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
