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

          <!-- Pilih Siswa -->
          <div class="form-group">
            <label>Nama Siswa</label>
            <select class="custom-input" v-model="form.siswa">
              <option disabled value="">Pilih nama siswa...</option>
              <option v-for="siswa in siswaList" :key="siswa.id" :value="siswa.id">
                {{ siswa.name }}
              </option>
            </select>
          </div>

          <!-- Keterangan Absensi -->
          <div class="form-group">
            <label>Keterangan</label>
            <div class="radio-group">

              <label class="radio-label" :class="{ active: form.status === 'hadir' }">
                <input type="radio" v-model="form.status" value="hadir">
                <span>Hadir</span>
              </label>

              <label class="radio-label" :class="{ active: form.status === 'sakit' }">
                <input type="radio" v-model="form.status" value="sakit">
                <span>Sakit</span>
              </label>

              <label class="radio-label" :class="{ active: form.status === 'izin' }">
                <input type="radio" v-model="form.status" value="izin">
                <span>Izin</span>
              </label>

              <label class="radio-label" :class="{ active: form.status === 'alpha' }">
                <input type="radio" v-model="form.status" value="alpha">
                <span>Alfa</span>
              </label>

            </div>
          </div>

          <!-- Catatan -->
          <div class="form-group">
            <label>Catatan (Opsional)</label>
            <textarea class="custom-textarea" v-model="form.catatan"
              placeholder="Contoh: Surat dokter / acara keluarga"></textarea>
          </div>

          <!-- Button -->
          <button class="submit-btn" @click="submitAbsensi" :disabled="!isFormValid">
            <ion-icon :icon="saveOutline"></ion-icon>
            <span>Simpan Absensi</span>
          </button>

        </div>
      </div>

      <!-- Toast -->
      <ion-toast :is-open="showToast" message="Absensi berhasil disimpan" :duration="2000"
        @didDismiss="showToast = false" color="success" />

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonTitle, IonContent, IonIcon, IonToast
} from '@ionic/vue'
import { createOutline, saveOutline } from 'ionicons/icons'
import api from '@/services/api'

const siswaList = ref([])
const showToast = ref(false)
const sesiId = ref(null)

const form = ref({
  siswa: '',
  status: '',
  catatan: ''
})


const isFormValid = computed(() => {
  return form.value.siswa && form.value.status
})

// ambil siswa dari backend
const fetchSiswa = async () => {
  try {
    const res = await api.get(`/absensi/murid-sesi/${sesiId.value}`)
    siswaList.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  const session = localStorage.getItem('sesi_aktif')

  if (!session) {
    console.warn('Sesi belum ada')
    return
  }

  try {
    const parsed = JSON.parse(session)
    sesiId.value = parsed.sesi_id
    fetchSiswa()
  } catch (err) {
    console.error('Session error:', err)
  }
})

// submit ke backend
const submitAbsensi = async () => {
  try {
    await api.post('/absensi/manual', {
      sesi_id: sesiId.value,
      data: [
        {
          murid_id: form.value.siswa,
          status: form.value.status
        }
      ]
    })

    showToast.value = true

    form.value = {
      siswa: '',
      status: '',
      catatan: ''
    }

  } catch (err) {
    console.error(err.response?.data || err)
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
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

.custom-input,
.custom-textarea {
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

.custom-input:focus,
.custom-textarea:focus {
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
