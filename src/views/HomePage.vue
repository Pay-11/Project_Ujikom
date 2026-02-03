<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar class="header">
        <div class="header-content">
          <ion-avatar>
            <ion-icon :icon="personOutline"></ion-icon>
          </ion-avatar>
          <div>
            <h2>Peter Crouch</h2>
            <p>XII RPL 2</p>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content> 

      <!-- CARD JADWAL -->
      <div class="card">
        <p class="subtitle">Daftar jadwal berlangsung</p>
        <p class="guru">👤 Rubaetul Adawiyah, S.Pd.I, M.M.Pd.</p>

        <div class="card-row">
          <div>
            <h3>Bahasa Indonesia</h3>
            <span>09:30 - 11:50 AM</span>
          </div>
          <button class="btn-light">Lihat Jadwal</button>
        </div>
      </div>

      <!-- MENU -->
      <div class="menu">
        <div class="menu-item">
          <ion-icon :icon="peopleOutline" />
          <p>Daftar Piket</p>
        </div>
        <div class="menu-item">
          <ion-icon :icon="bookOutline" />
          <p>Materi</p>
        </div>
        <div class="menu-item">
          <ion-icon :icon="calendarOutline" />
          <p>Jadwal Pelajaran</p>
        </div>
      </div>

      <!-- ABSENSI -->
      <h4 class="section-title">Daftar absensi hari ini</h4>

      <div class="absen active">
  <span>Bahasa Indonesia</span>

  <ion-button
    size="small"
    color="success"
    router-link="/scan"
  >
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

      <div class="absen disabled">
        <span>Pilihan PPLG</span>
        <button class="scan disabled">Scan</button>
      </div>

    </ion-content>

    <!-- BOTTOM NAV -->
    <ion-footer>
      <div class="bottom-nav">
        <div>
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
import { IonPage, IonHeader, IonToolbar, IonContent, IonFooter, IonIcon, IonAvatar,IonButton } from '@ionic/vue'
import { personOutline, homeOutline, peopleOutline, bookOutline, calendarOutline } from 'ionicons/icons'
</script>

<style scoped>
.header {
  --background: #3f6f3c;
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
  border-radius: 50%;
  background: #6fa56f;
  border: 2px solid white;

  display: flex;
  align-items: center;
  justify-content: center;
}

.header ion-avatar ion-icon {
  font-size: 22px;
  color: white;
}

.header ion-icon {
  font-size: 28px;
  color: white;
}
.header h2 {
  margin: 0;
  color: white;
  font-size: 16px;
}
.header p {
  margin: 0;
  font-size: 12px;
  color: #dff0df;
}

/* CARD */
.card {
  background: #3f6f3c;
  margin: 16px;
  padding: 16px;
  border-radius: 12px;
  color: white;
}
.subtitle {
  font-size: 13px;
  opacity: 0.9;
}
.guru {
  font-size: 12px;
}
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-light {
  background: #6fa56f;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  color: white;
  font-size: 12px;
}

/* MENU */
.menu {
  display: flex;
  justify-content: space-around;
  margin: 12px 0;
}
.menu-item {
  background: #3f6f3c;
  width: 90px;
  height: 90px;
  border-radius: 12px;
  color: white;
  text-align: center;
  padding-top: 18px;
}
.menu-item ion-icon {
  font-size: 26px;
}
.menu-item p {
  font-size: 12px;
  margin-top: 6px;
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
}
.absen.active {
  background: #3f6f3c;
  color: white;
}
.absen.disabled {
  background: #d9d9d9;
  color: #888;
}
.scan {
  border: none;
  padding: 4px 14px;
  border-radius: 6px;
}
.scan.active {
  background: #6fa56f;
  color: white;
}
.scan.disabled {
  background: #9e9e9e;
  color: #eee;
}

/* BOTTOM NAV */
.bottom-nav {
  background: #3f6f3c;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}
.bottom-nav ion-icon {
  font-size: 22px;
  color: white;
}
.bottom-nav p {
  margin: 0;
  font-size: 12px;
  color: white;
}
</style>
