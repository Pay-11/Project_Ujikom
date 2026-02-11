<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar class="header">
        <div class="header-content">
          <ion-avatar>
            <ion-icon :icon="personOutline" />
          </ion-avatar>
          <div>
            <h2>EGILUY</h2>
            <p>XII RPL 2</p>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- CARD JADWAL -->
      <div class="card">
        <p class="subtitle">Jadwal Aktif Hari Ini</p>

        <div class="jadwal-info">
          <h3>Bahasa Indonesia</h3>
          <span class="kelas">XII RPL 2</span>
          <p class="jam">09:30 – 11:50 WIB</p>
        </div>
      </div>

      <!-- MENU -->
      <div class="menu">
        <div class="menu-item">
          <ion-icon :icon="calendarOutline" />
          <p>Jadwal Pelajaran</p>
        </div>

        <div class="menu-item">
          <ion-icon :icon="peopleOutline" />
          <p>Jadwal Piket</p>
        </div>
      </div>

      <!-- ABSENSI -->
      <h4 class="section-title">Absensi Hari Ini</h4>

      <div class="absen active">
        <span>Bahasa Indonesia</span>
        <ion-button size="small" router-link="/scan">
          Scan
        </ion-button>
      </div>

      <div class="absen disabled">
        <span>Matematika</span>
        <button class="scan disabled">Scan</button>
      </div>

      <div class="absen disabled">
        <span>Mulok Jepang</span>
        <button class="scan disabled">Scan</button>
      </div>

    </ion-content>

    <!-- BOTTOM NAV -->
    <ion-footer>
      <div class="bottom-nav">
        <div class="active">
          <ion-icon :icon="homeOutline" />
          <p>Beranda</p>
        </div>
        <div>
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
  IonContent,
  IonFooter,
  IonIcon,
  IonAvatar,
  IonButton
} from '@ionic/vue'

import {
  personOutline,
  homeOutline,
  peopleOutline,
  calendarOutline
} from 'ionicons/icons'
</script>

<style scoped>
/* HEADER */
.header {
  --background: white;
  border-bottom: 2px solid #e53935;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}
.header ion-avatar {
  width: 40px;
  height: 40px;
  background: #fdecea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header ion-icon {
  font-size: 22px;
  color: #e53935;
}
.header h2 {
  margin: 0;
  font-size: 16px;
  color: #e53935;
}
.header p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* CARD */
.card {
  background: white;
  margin: 16px;
  padding: 16px;
  border-radius: 14px;
  border-left: 6px solid #e53935;
  box-shadow: 0 4px 10px rgba(0,0,0,.08);
}
.subtitle {
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
}
.jadwal-info h3 {
  margin: 4px 0;
  font-size: 18px;
  color: #222;
}
.kelas {
  font-size: 13px;
  color: #e53935;
  font-weight: 500;
}
.jam {
  margin-top: 4px;
  font-size: 13px;
  color: #555;
}

/* MENU */
.menu {
  display: flex;
  justify-content: space-around;
  margin: 12px 0;
}
.menu-item {
  background: white;
  width: 120px;
  height: 90px;
  border-radius: 12px;
  text-align: center;
  padding-top: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.menu-item ion-icon {
  font-size: 26px;
  color: #e53935;
}
.menu-item p {
  font-size: 12px;
  margin-top: 6px;
  color: #333;
}

/* ABSEN */
.section-title {
  margin: 16px;
  font-weight: bold;
}
.absen {
  margin: 0 16px 10px;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.absen.active {
  background: #fdecea;
  border-left: 6px solid #e53935;
}
.absen.disabled {
  background: #f2f2f2;
  color: #aaa;
}
ion-button {
  --background: #e53935;
  --border-radius: 8px;
}

/* BOTTOM NAV */
.bottom-nav {
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 2px solid #e53935;
}
.bottom-nav ion-icon {
  font-size: 22px;
  color: #999;
}
.bottom-nav .active ion-icon,
.bottom-nav .active p {
  color: #e53935;
}
.bottom-nav p {
  margin: 0;
  font-size: 12px;
}
</style>
