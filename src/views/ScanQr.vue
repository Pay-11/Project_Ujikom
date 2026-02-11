<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar class="scan-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Scan Untuk Absen</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENT -->
    <ion-content fullscreen class="scan-page">

      <!-- CAMERA AREA -->
      <div class="camera-area">
      <!-- CAMERA ICON -->
       
        <ion-icon
        name="camera-outline"
        class="frame-camera-icon"
        ></ion-icon>


        <!-- FRAME -->
        <div class="scan-frame">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>

          <!-- SCAN LINE -->
          <div class="scan-line"></div>
        </div>

        <p class="hint">Arahkan QR ke dalam kotak</p>
      </div>

      <!-- STATUS -->
      <div class="status-box">
        <ion-icon name="qr-code-outline"></ion-icon>
        <p>Siap memindai QR</p>
      </div>

      <!-- FLOATING BUTTON -->
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button class="scan-btn">
          <ion-icon name="camera-outline"></ion-icon>
        </ion-fab-button>
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
  IonIcon
} from '@ionic/vue'
</script>

<style scoped>
/* HEADER */
.scan-header {
  --background: #E53935;
  color: white;
}




/* PAGE */
.scan-page {
  --background: black;
}

/* CAMERA AREA */
.camera-area {
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* FRAME */
.scan-frame {
  position: relative;
  width: 260px;
  height: 260px;
}

.corner {
  position: absolute;
  width: 36px;
  height: 36px;
  border: 4px solid white;
  border-radius: 8px;
}

.tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.tr { top: 0; right: 0; border-left: none; border-bottom: none; }
.bl { bottom: 0; left: 0; border-right: none; border-top: none; }
.br { bottom: 0; right: 0; border-left: none; border-top: none; }

/* SCAN LINE */
.scan-line {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 80%;
  height: 2px;
  background: #E53935;
  animation: scan 2s infinite ease-in-out;
}

@keyframes scan {
  0% { top: 15%; opacity: 0.3; }
  50% { top: 80%; opacity: 1; }
  100% { top: 15%; opacity: 0.3; }
}

/* HINT */
.hint {
  margin-top: 16px;
  color: #cfcfcf;
  font-size: 14px;
}

/* STATUS */
.status-box {
  margin-top: 12px;
  text-align: center;
  color: #E53935;
}
.status-box ion-icon {
  font-size: 22px;
  margin-bottom: 4px;
}

/* FAB */
.scan-btn {
  --background: #E53935;
}
</style>
