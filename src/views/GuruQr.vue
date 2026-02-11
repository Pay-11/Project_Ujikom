<template>
  <ion-page>

    <!-- ===== HEADER ===== -->
    <ion-header>
      <ion-toolbar class="header">

        <!-- BACK BUTTON -->
        <ion-buttons slot="start">
          <ion-back-button default-href="/guru" />
        </ion-buttons>

        <ion-title>Absensi Guru</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- ===== CONTENT ===== -->
    <ion-content>

      <!-- ABSEN UTAMA -->
      <div class="absen-card">
        <p class="subtitle">Mulai Absensi Kelas</p>
        <h2>XII RPL 2</h2>

        <!-- QR -->
        <div class="qr-wrapper">
          <img
            v-if="absenAktif"
            :src="qrUrl"
            alt="QR Absensi"
          />
          <div v-else class="qr-placeholder">
            QR belum aktif
          </div>
        </div>

        <!-- BUTTON -->
        <ion-button
          expand="block"
          color="success"
          v-if="!absenAktif"
          @click="mulaiAbsen"
        >
          Mulai Absensi
        </ion-button>

        <ion-button
          expand="block"
          color="danger"
          v-else
          @click="akhiriAbsen"
        >
          Akhiri Absensi
        </ion-button>

        <p v-if="absenAktif" class="timer">
          ⏱ Berakhir dalam {{ waktu }} menit
        </p>
      </div>

      <!-- MENU -->
      <ion-list class="menu">

        <ion-item button>
          <ion-icon slot="start" :icon="peopleOutline" />
          <ion-label>Daftar Hadir Siswa</ion-label>
        </ion-item>

        <ion-item button>
          <ion-icon slot="start" :icon="calendarOutline" />
          <ion-label>Rekap Absensi</ion-label>
        </ion-item>

        <ion-item button>
          <ion-icon slot="start" :icon="settingsOutline" />
          <ion-label>Pengaturan Absensi</ion-label>
        </ion-item>

      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
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
  IonLabel,
  IonButtons,
  IonBackButton
} from '@ionic/vue'

import {
  peopleOutline,
  calendarOutline,
  settingsOutline
} from 'ionicons/icons'

const absenAktif = ref(false)
const waktu = ref(45)

const qrUrl = ref(
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ABSEN_XII_RPL_2'
)

function mulaiAbsen() {
  absenAktif.value = true
}

function akhiriAbsen() {
  absenAktif.value = false
}
</script>

<style scoped>
/* ===== HEADER ===== */
.header {
  --background: linear-gradient(135deg, #E53935, #1b5e20);
  color: white;
}

/* ===== CARD ABSEN ===== */
.absen-card {
  margin: 16px;
  padding: 20px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
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

/* ===== TIMER ===== */
.timer {
  margin-top: 10px;
  color: #2e7d32;
  font-weight: 600;
}

/* ===== MENU ===== */
.menu {
  margin: 16px;
  border-radius: 16px;
  overflow: hidden;
}

.menu ion-item {
  --border-color: transparent;
}

.menu ion-icon {
  color: #E53935;
}
</style>
