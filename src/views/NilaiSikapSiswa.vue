<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Nilai Sikap Saya</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <!-- KARTU PROFIL SINGKAT -->
      <div class="profile-card">
        <div class="avatar-box">
          <ion-icon :icon="personOutline"></ion-icon>
        </div>
        <div class="profile-info">
          <h3>{{ studentName }}</h3>
          <p>Laporan Penilaian Sikap Bulanan</p>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="empty-state" v-if="isLoading">
           Memuat riwayat penilaian...
        </div>
        <div class="empty-state" v-else-if="historyData.length === 0">
           Belum ada nilai sikap yang tercatat untuk Anda.
        </div>

        <div class="timeline-container" v-else>
          <div class="timeline-item" v-for="(hist, idx) in historyData" :key="idx">
            <!-- TITIK BULATAN DI KIRI -->
            <div class="timeline-dot" :class="getDotClass(hist.sikap)"></div>
            <div class="timeline-line" v-if="idx !== historyData.length - 1"></div>
            
            <!-- KARTU KONTEN -->
            <div class="timeline-content">
              <div class="hist-header">
                <span class="hist-date">{{ hist.period_label }}</span>
                <span class="badge" :class="getBadgeClass(hist.sikap)">{{ hist.sikap }}</span>
              </div>
              <div class="hist-body">
                <p><strong>Penilai:</strong> {{ hist.guru_name }}</p>
                <div class="feedback-box" v-if="hist.show_feedback && hist.keterangan">
                   "{{ hist.keterangan }}"
                </div>
                <div class="feedback-box hidden-feedback" v-else-if="!hist.show_feedback && hist.keterangan">
                   <ion-icon :icon="lockClosedOutline"></ion-icon> Catatan guru disembunyikan.
                </div>
                <div class="feedback-box empty-feedback" v-else>
                   Tidak ada catatan tambahan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon } from '@ionic/vue';
import { personOutline, lockClosedOutline } from 'ionicons/icons';
import api from '../services/api';

const historyData = ref([]);
const studentName = ref('Memuat...');
const isLoading = ref(true);

onMounted(async () => {
  // Ambil nama dari user info di localstorage jika ada
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    studentName.value = user.name;
  } else {
    studentName.value = 'Siswa';
  }

  try {
    // Memanggil API laravel untuk list nilai sikap user
    const response = await api.get('riwayat-sikap'); 
    // asumsinya laravel mengembalikan: response.data.data = [{ period_label: '..', sikap: '..', keterangan: '..', guru_name: '..', show_feedback: true }, ...]
    historyData.value = response.data.data || [];
  } catch (error) {
    console.error("Gagal mengambil riwayat sikap:", error);
    // historyData.value tetap kosong []
  } finally {
    isLoading.value = false;
  }
});

const getBadgeClass = (sikap) => {
  if (sikap.includes('Sangat Baik') || sikap.includes('Baik')) return 'b-green';
  if (sikap.includes('Cukup')) return 'b-yellow';
  return 'b-red';
};

const getDotClass = (sikap) => {
  if (sikap.includes('Sangat Baik') || sikap.includes('Baik')) return 'dot-green';
  if (sikap.includes('Cukup')) return 'dot-yellow';
  return 'dot-red';
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.custom-header {
  --background: #e53935;
  color: white;
}

.bg-light {
  --background: #f8fafc;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #e53935;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  z-index: 0;
}

.profile-card {
  position: relative;
  z-index: 10;
  background: white;
  margin: 10px 20px 20px;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 25px rgba(229, 57, 53, 0.1);
}

.avatar-box {
  width: 50px;
  height: 50px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #64748b;
}

.profile-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.profile-info p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.content-wrapper {
  padding: 0 20px 40px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  color: #94a3b8;
  font-size: 14px;
}

/* TIMELINE STYLES */
.timeline-container {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  position: relative;
  margin-bottom: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-top: 5px;
  position: relative;
  z-index: 2;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #e2e8f0;
}

.dot-green { background: #10b981; box-shadow: 0 0 0 2px #d1fae5; }
.dot-yellow { background: #f59e0b; box-shadow: 0 0 0 2px #fef3c7; }
.dot-red { background: #ef4444; box-shadow: 0 0 0 2px #fee2e2; }

.timeline-line {
  position: absolute;
  left: 7.5px;
  top: 25px;
  bottom: -25px;
  width: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.timeline-content {
  flex: 1;
  margin-left: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  border: 1px solid #f1f5f9;
}

.hist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hist-date {
  font-weight: 800;
  color: #1e293b;
  font-size: 15px;
}

.badge {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.b-green { background: #d1fae5; color: #10b981; }
.b-yellow { background: #fef3c7; color: #f59e0b; }
.b-red { background: #fee2e2; color: #ef4444; }

.hist-body p {
  margin: 0 0 10px;
  font-size: 13px;
  color: #64748b;
}

.feedback-box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #334155;
  font-style: italic;
  border-left: 3px solid #cbd5e1;
}

.hidden-feedback {
  background: #f1f5f9;
  color: #94a3b8;
  font-style: normal;
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-feedback {
  background: transparent;
  padding: 0;
  border-left: none;
  color: #94a3b8;
  font-style: normal;
}

</style>
