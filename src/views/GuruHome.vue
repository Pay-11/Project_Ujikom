<template>
  <ion-page>

    <!-- ===== HEADER ===== -->
    <ion-header>
      <ion-toolbar class="header">
        <ion-buttons slot="start">
          <ion-avatar class="avatar">
            <ion-icon :icon="personOutline" />
          </ion-avatar>
        </ion-buttons>

        <ion-title>
          <div class="title">
            <strong>PA LUDDI</strong>
            <p>Guru RPL</p>
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- ===== CONTENT ===== -->
    <ion-content>

      <!-- JADWAL BERLANGSUNG -->
      <div class="section">
        <h4>Daftar jadwal berlangsung</h4>

        <div class="card">
          <p class="card-subtitle">Jadwal Aktif Hari Ini</p>

          <div class="card-content">
            <span class="kelas-badge">XII RPL 2</span>
            <h3>Konsentrasi</h3>
            <p class="jam">09:30 - 11:50</p>
          </div>

          <!-- BUTTON ABSEN -->
          <div class="card-action">
            <ion-button
              size="small"
              class="btn-absen"
              router-link="/guruqr"
            >
              Absen
            </ion-button>
          </div>
        </div>
      </div>

      <!-- KELAS SELANJUTNYA -->
      <div class="section">
        <h4>Kelas Selanjutnya</h4>

        <div class="kelas-card active">XI PPLG 2</div>
        <div class="kelas-card">X AKL</div>
        <div class="kelas-card">XII IPS</div>
        <div class="kelas-card">X PPLG 3</div>
      </div>

    </ion-content>

    <!-- ===== FOOTER ===== -->
    <ion-footer>
      <div class="bottom-nav">
        <div class="nav-item active">
          <ion-icon :icon="homeOutline" />
          <p>Beranda</p>
        </div>

        <div class="nav-item">
          <ion-icon :icon="clipboardOutline" />
          <p>Rekap</p>
        </div>

        <div class="nav-item">
          <ion-icon :icon="personOutline" />
          <p>Saya</p>
        </div>
      </div>
    </ion-footer>

  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButtons,
  IonIcon,
  IonAvatar,
  IonButton
} from '@ionic/vue'

import {
  personOutline,
  homeOutline,
  clipboardOutline
} from 'ionicons/icons'
</script>

<style scoped>
/* ===== HEADER ===== */
.header {
  --background: #ffffff;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #E53935;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar ion-icon {
  color: #E53935;
  font-size: 20px;
}

.title {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.title strong {
  font-size: 14px;
  color: #E53935;
}

.title p {
  margin: 0;
  font-size: 11px;
  color: #888;
}

/* ===== SECTION ===== */
.section {
  padding: 16px;
}

.section h4 {
  font-size: 14px;
  margin-bottom: 10px;
}

/* ===== CARD ===== */
.card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  border-left: 5px solid #E53935;
  box-shadow: 0 6px 16px rgba(0,0,0,.08);
}

.card-subtitle {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.card-content h3 {
  margin: 6px 0 4px;
  font-size: 16px;
}

.jam {
  font-size: 13px;
  color: #555;
}

.kelas-badge {
  background: #FFEBEE;
  color: #E53935;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
}

/* ===== BUTTON ===== */
.card-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.btn-absen {
  --background: #E53935;
  --border-radius: 8px;
  font-size: 12px;
}

/* ===== KELAS ===== */
.kelas-card {
  background: #f1f1f1;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.kelas-card.active {
  background: #FFEBEE;
  color: #E53935;
}

/* ===== FOOTER ===== */
.bottom-nav {
  background: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  border-top: 1px solid #eee;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.nav-item ion-icon {
  font-size: 22px;
}

.nav-item.active {
  color: #E53935;
}
</style>
