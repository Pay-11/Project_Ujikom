<template>
  <ion-page>

    <ion-header>
      <ion-toolbar class="header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/guru" />
        </ion-buttons>

        <ion-title>Absensi Guru</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- CARD ABSEN -->
      <div class="absen-card">
        <p class="subtitle">Mulai Absensi Kelas</p>
        <h2>XII RPL 2</h2>

        <div class="qr-wrapper">
          <img v-if="absenAktif" :src="qrUrl" alt="QR Absensi" />
          <div v-else class="qr-placeholder">
            QR belum aktif
          </div>
        </div>

        <ion-button expand="block" color="success" @click="mulaiAbsen">
          Mulai Absensi
        </ion-button>
      </div>


      <!-- LIST SISWA YANG SUDAH ABSEN -->
      <div class="student-list-section" v-if="absenAktif">

        <div class="list-header">
          <h3>
            Sudah Hadir
            <span class="badge">{{ siswaAbsen.length }}</span>
          </h3>
        </div>

        <div v-if="isLoading" class="empty-state">
          Memuat data siswa...
        </div>

        <div v-else-if="siswaAbsen.length === 0" class="empty-state">
          Belum ada siswa yang melakukan scan
        </div>

        <ion-list class="student-list" v-else>

          <ion-item v-for="student in siswaAbsen" :key="student.id" class="success-anim">

            <ion-icon slot="start" :icon="personOutline" class="avatar-icon" />

            <div class="student-info">
              <h2>{{ student.name }}</h2>
              <p v-if="student.status === 'hadir'">
                Telah discan / Hadir
              </p>
              <p v-else>
                {{ student.status }}
              </p>
            </div>

          </ion-item>

        </ion-list>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>

import { ref, onMounted, onUnmounted, computed } from 'vue'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonIcon,
  IonButtons,
  IonBackButton
} from '@ionic/vue'

import { personOutline } from 'ionicons/icons'
import api from '../services/api'

const absenAktif = ref(false)
const qrUrl = ref('')
const sesiId = ref(null)

const allStudents = ref([])
const isLoading = ref(true)

let pollingInterval = null

// ======================
// FILTER SISWA HADIR
// ======================
const siswaAbsen = computed(() => {
  return allStudents.value.filter(s => s.status !== null)
})

// ======================
// NORMALIZE DATA
// ======================
const normalizeStudents = (data) => {

  if (!Array.isArray(data) && typeof data === 'object') {
    data = Object.values(data)
  }

  return data.map(m => ({
    id: String(m.id),
    name: m.name,
    status: m.status
  }))
}

// ======================
// POLLING (FIX ENDPOINT)
// ======================
const startPolling = async () => {

  if (pollingInterval) clearInterval(pollingInterval)

  isLoading.value = true

  try {
    const res = await api.get(`absensi/murid-sesi/${sesiId.value}`)
    allStudents.value = normalizeStudents(res.data.data || [])
  } catch (err) {
    console.error("Gagal memuat data murid:", err)
  } finally {
    isLoading.value = false
  }

  pollingInterval = setInterval(async () => {

    try {

      const res = await api.get(`absensi/murid-sesi/${sesiId.value}`)

      const dataMurid = normalizeStudents(res.data.data || [])

      dataMurid.forEach(m => {

        const existing = allStudents.value.find(s => s.id === m.id)

        if (existing) {
          if (m.status !== null && existing.status !== m.status) {
            existing.status = m.status
          }
        } else {
          allStudents.value.push(m)
        }

      })

    } catch (err) {
      console.error("Polling gagal:", err)
    }

  }, 5000)

}

// ======================
// MULAI ABSEN
// ======================
const mulaiAbsen = async () => {

  try {

    const response = await api.post('absensi/sesi')
    const data = response.data

    const sessionData = {
      sesi_id: data.sesi_id,
      qr_image: data.qr_image,
      started_at: new Date().toISOString()
    }

    localStorage.setItem('sesi_aktif', JSON.stringify(sessionData))

    qrUrl.value = sessionData.qr_image
    sesiId.value = sessionData.sesi_id

    absenAktif.value = true
    allStudents.value = []

    startPolling()

  } catch (error) {

    console.error("Gagal membuka sesi:", error)

    if (error.response && error.response.data) {
      alert(error.response.data.message)
    } else {
      alert("Kesalahan jaringan")
    }

  }

}

// ======================
// RESTORE SESSION
// ======================
onMounted(() => {

  const savedSession = localStorage.getItem('sesi_aktif')

  if (!savedSession) return

  try {

    const data = JSON.parse(savedSession)

    // VALIDASI DATA
    if (!data.sesi_id || !data.qr_image) {
      localStorage.removeItem('sesi_aktif')
      return
    }

    // OPTIONAL EXPIRE (2 JAM)
    const now = new Date()
    const start = new Date(data.started_at)

    const diffMinutes = (now - start) / 1000 / 60

    if (diffMinutes > 120) {
      localStorage.removeItem('sesi_aktif')
      return
    }

    qrUrl.value = data.qr_image
    sesiId.value = data.sesi_id

    absenAktif.value = true

    startPolling()

  } catch (err) {
    console.error("Session rusak:", err)
    localStorage.removeItem('sesi_aktif')
  }

})

// ======================
// STOP POLLING
// ======================
onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})

</script>

<style scoped>
/* ===== HEADER ===== */
.header {
  --background: linear-gradient(135deg, #E53935, #E53935);
  color: white;
}

/* ===== CARD ABSEN ===== */
.absen-card {
  margin: 16px;
  padding: 20px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.subtitle {
  font-size: 13px;
  color: #666;
}

.absen-card h2 {
  margin: 6px 0 16px;
}

/* ===== QR ===== */
.qr-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.qr-wrapper img {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  background: #f5f5f5;
  padding: 10px;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

/* ===== TIMER & REFRESH TEXT ===== */
.timer {
  margin-top: 10px;
  color: #2e7d32;
  font-weight: 600;
  margin-bottom: 5px;
}

.qr-refresh-text {
  margin: 0;
  font-size: 11px;
  color: #f59e0b;
  font-style: italic;
  font-weight: 500;
}

/* ===== STUDENT LIST REALTIME ===== */
.student-list-section {
  margin: 16px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding-bottom: 10px;
}

.list-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  background: #e53935;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.empty-state {
  padding: 30px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

.student-list {
  padding: 0;
  background: transparent;
}

.student-item {
  --padding-start: 16px;
  --inner-padding-end: 16px;
}

.student-info {
  flex: 1;
}

.student-info h2 {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.student-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.avatar-icon {
  background: #f3f4f6;
  padding: 10px;
  border-radius: 50%;
  color: #6b7280;
  margin-right: 15px;
}

.success-anim {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
