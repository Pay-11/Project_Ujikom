<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Scan Untuk Absen</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENT -->
    <ion-content class="scan-content">
      <div class="scanner-box">
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>
        <div class="scan-line"></div>
      </div>

      <p class="hint">Arahkan kamera ke QR Code</p>
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
  IonBackButton
} from '@ionic/vue'
</script>

<style scoped>
.scan-content {
  --background: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.scanner-box {
  width: 240px;
  height: 240px;
  position: relative;
}

.corner {
  width: 30px;
  height: 30px;
  border: 3px solid white;
  position: absolute;
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
  top: 50%;
  left: 10%;
  width: 80%;
  height: 2px;
  background: white;
}

.hint {
  margin-top: 24px;
  color: #cfcfcf;
  font-size: 14px;
}
</style>
