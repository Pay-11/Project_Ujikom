<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="scan-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" color="light" />
        </ion-buttons>
        <ion-title>Scan Kehadiran</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="scan-page">
      <div class="header-background"></div>

      <div class="content-wrapper">
        <div class="info-card">
          <h2 class="title">Arahkan QR Code</h2>
          <p class="subtitle">
            Posisikan QR code ke dalam kotak scanner untuk memindai kehadiran secara otomatis.
          </p>
        </div>

        <!-- CAMERA AREA -->
        <div class="camera-container">

          <video ref="videoRef" autoplay muted playsinline style="width:100%; height:100%; object-fit:cover;"></video>

          <div v-if="!isScanning && !scanResult" class="placeholder-overlay">
            <ion-spinner name="crescent" color="success" v-if="isInitializing"></ion-spinner>
            <p v-else>Tekan tombol di bawah untuk memulai kamera</p>
          </div>

          <!-- Scan Frame -->
          <div v-if="isScanning" class="scan-frame-overlay">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
            <div class="scan-line"></div>
          </div>
        </div>

        <!-- SCANNED STUDENTS LIST -->
        <div v-if="scannedStudents.length > 0" class="scanned-list-container">
          <h3 class="list-title">Siswa Hadir Baru Saja</h3>
          <div class="student-list">
            <div v-for="(student, index) in scannedStudents" :key="index" class="student-item success-anim">
              <div class="avatar">
                <ion-icon :icon="personOutline"></ion-icon>
              </div>
              <div class="student-info">
                <h4>{{ student.name }}</h4>
                <p>Berhasil masuk daftar hadir</p>
              </div>
              <div class="status-icon">
                <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAB -->
      <ion-fab vertical="bottom" horizontal="center" slot="fixed" class="scan-fab">
        <ion-fab-button class="scan-btn" @click="toggleScan">
          <ion-icon :icon="isScanning ? stopCircleOutline : cameraOutline"></ion-icon>
        </ion-fab-button>
        <p class="fab-label">{{ isScanning ? 'Hentikan' : 'Mulai Scan' }}</p>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSpinner
} from '@ionic/vue'

import {
  cameraOutline,
  stopCircleOutline,
  checkmarkCircleOutline,
  personOutline
} from 'ionicons/icons'

import { ref, onUnmounted } from "vue"

import {
  BrowserMultiFormatReader,
  NotFoundException,
  BarcodeFormat,
  DecodeHintType
} from "@zxing/library"

import api from '../services/api'

const videoRef = ref(null)

const isScanning = ref(false)
const isInitializing = ref(false)
const scannedStudents = ref([])

let stream = null
let isProcessing = false

/* ZXING */
const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE])

const codeReader = new BrowserMultiFormatReader(hints)

/* ===============================
   SEND KE BACKEND (FIXED)
================================= */
const sendToBackend = async (token) => {
  try {
    const user = localStorage.getItem("user")

    if (!user) {
      alert("User tidak ditemukan. Login ulang.")
      return
    }

    const parsedUser = JSON.parse(user)

    const response = await api.post("absensi/scan", {
      token: token // ✅ FIX
    })

    const data = response.data

    scannedStudents.value.unshift({
      name: parsedUser.name || "Berhasil absen",
      id: parsedUser.id
    })

    alert(data.message || "Absensi berhasil!")

  } catch (err) {

    if (err.response?.data?.message) {
      alert(err.response.data.message)
    } else {
      console.error(err)
      alert("Server error / koneksi gagal")
    }

  } finally {
    isProcessing = false
  }
}

/* ===============================
   START SCAN
================================= */
const startScanner = async () => {

  if (!videoRef.value) return

  try {

    isInitializing.value = true

    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    })

    videoRef.value.srcObject = stream
    await videoRef.value.play()

    await codeReader.decodeFromVideoDevice(
      null,
      videoRef.value,
      async (result, err) => {

        if (result && !isProcessing) {

          isProcessing = true

          const token = result.getText()

          console.log("QR:", token)

          await sendToBackend(token)

          // ✅ FIX DELAY biar gak glitch
          setTimeout(() => stopScanner(), 300)
        }

        if (err && !(err instanceof NotFoundException)) {
          console.error(err)
        }

      }
    )

    isScanning.value = true

  } catch (err) {

    console.error(err)
    alert("Kamera gak bisa diakses")

  } finally {
    isInitializing.value = false
  }

}

/* ===============================
   STOP SCAN
================================= */
const stopScanner = () => {

  codeReader.reset()

  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null
  }

  isScanning.value = false
}

/* ===============================
   TOGGLE
================================= */
const toggleScan = () => {
  isScanning.value ? stopScanner() : startScanner()
}

onUnmounted(() => {
  stopScanner()
})
</script>

<style>
#reader img[alt="Info icon"] {
  display: none !important;
}
</style>

<style scoped>
/* SEMUA STYLE ANDA TETAP SAMA */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.scan-header {
  --background: #e53935;
  color: white;
  --box-shadow: none;
}

.scan-page {
  --background: #f4f7f6;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 180px;
  background: #e53935;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-card {
  background: white;
  width: 100%;
  max-width: 400px;
  padding: 20px 25px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  margin-bottom: 30px;
  margin-top: 10px;
}

.info-card .title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px;
}

.info-card .subtitle {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.camera-container {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 24px;
  overflow: hidden;
  background: #f9fafb;
  box-shadow: 0 15px 35px rgba(229, 57, 53, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid white;
}

.placeholder-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
  text-align: center;
  padding: 30px;
  color: #9ca3af;
  font-size: 15px;
  font-weight: 500;
  z-index: 5;
  border-radius: 19px;
}

.scan-frame-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 240px;
  z-index: 10;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 4px solid #e53935;
  border-radius: 12px;
}

.tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.scan-line {
  position: absolute;
  top: 10%;
  left: 5%;
  width: 90%;
  height: 3px;
  background: #e53935;
  border-radius: 10px;
  box-shadow: 0 0 10px #e53935, 0 0 20px #e53935;
  animation: scan 2s infinite ease-in-out;
}

@keyframes scan {
  0% {
    top: 5%;
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    top: 95%;
    opacity: 0;
  }
}

.scanned-list-container {
  margin-top: 30px;
  width: 100%;
  max-width: 400px;
}

.list-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 15px;
  padding-left: 5px;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-item {
  background: white;
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border-left: 4px solid #10b981;
}

.student-item .avatar {
  background: #f3f4f6;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6b7280;
  font-size: 20px;
  margin-right: 15px;
}

.student-info {
  flex: 1;
}

.student-info h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.student-info p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.status-icon {
  color: #10b981;
  font-size: 24px;
}

.success-anim {
  animation: slideFadeIn 0.3s ease-out;
}

@keyframes slideFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scan-fab {
  margin-bottom: 25px;
}

.scan-btn {
  --background: #e53935;
  width: 64px;
  height: 64px;
}

.fab-label {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
}
</style>