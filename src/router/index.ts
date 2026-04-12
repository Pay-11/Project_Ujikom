import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ScanQr from '../views/ScanQr.vue'
import GuruQr from '../views/GuruQr.vue'
import GuruHome from '../views/GuruHome.vue'
import Login from '../views/Login.vue'

// Import halaman baru
import JadwalPelajaran from '../views/JadwalPelajaran.vue'
import JadwalPiket from '../views/JadwalPiket.vue'
import RiwayatAbsensi from '../views/RiwayatAbsensi.vue'
import ProfileSiswa from '../views/ProfileSiswa.vue'
import ProfileGuru from '../views/ProfileGuru.vue'
import RekapAbsensi from '../views/RekapAbsensi.vue'
import AbsensiManual from '../views/AbsensiManual.vue'
import PenilaianSikap from '../views/PenilaianSikap.vue'
import RekapSikap from '../views/RekapSikap.vue'
import NilaiSikapSiswa from '../views/NilaiSikapSiswa.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/scan',
    name: 'Scan',
    component: ScanQr
  },
  {
    path: '/guru',
    name: 'Guru',
    component: GuruHome
  },
  {
    path: '/guruqr',
    name: 'GuruQr',
    component: GuruQr
  },
  {
    path: '/jadwal-pelajaran',
    name: 'JadwalPelajaran',
    component: JadwalPelajaran
  },
  {
    path: '/jadwal-piket',
    name: 'JadwalPiket',
    component: JadwalPiket
  },
  {
    path: '/riwayat-absensi',
    name: 'RiwayatAbsensi',
    component: RiwayatAbsensi
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileSiswa
  },
  {
    path: '/profile-guru',
    name: 'ProfileGuru',
    component: ProfileGuru
  },
  {
    path: '/rekap-absensi',
    name: 'RekapAbsensi',
    component: RekapAbsensi
  },
  {
    path: '/absensi-manual',
    name: 'AbsensiManual',
    component: AbsensiManual
  },
  {
    path: '/penilaian-sikap',
    name: 'PenilaianSikap',
    component: PenilaianSikap
  },
  {
    path: '/rekap-sikap',
    name: 'RekapSikap',
    component: RekapSikap
  },
  {
    path: '/nilai-sikap-siswa',
    name: 'NilaiSikapSiswa',
    component: NilaiSikapSiswa
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
