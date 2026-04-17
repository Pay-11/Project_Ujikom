<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <div class="header-content">
          <ion-icon :icon="arrowBack" @click="goBack" class="back-icon"></ion-icon>
          <h2>Poinku</h2>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <!-- POINT -->
      <div class="point-summary-card">
        <div class="point-label">Total Poin Anda</div>
        <div class="point-value">
          <ion-icon :icon="star"></ion-icon>
          {{ totalPoint }}
        </div>
        <div class="point-desc">
          Kumpulkan lebih banyak poin dengan hadir tepat waktu!
        </div>
      </div>

      <!-- TAB -->
      <div class="segment-container">
        <ion-segment v-model="selectedTab" mode="ios" class="custom-segment">
          <ion-segment-button value="voucher">
            <ion-label>Voucher</ion-label>
          </ion-segment-button>
          <ion-segment-button value="riwayat">
            <ion-label>Riwayat</ion-label>
          </ion-segment-button>
          <ion-segment-button value="peringkat">
            <ion-label>Peringkat</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- ================= VOUCHER ================= -->
      <div v-if="selectedTab === 'voucher'" class="tab-content">

        <h4 class="section-title">Voucher Dimiliki</h4>

        <!-- EMPTY STATE -->
        <div v-if="ownedVouchers.length === 0" class="empty">
          Belum ada voucher 😢
        </div>

        <!-- OWNED -->
        <div v-for="v in ownedVouchers" :key="v.name" class="voucher-card">
          <div class="voucher-icon-box bg-purple">
            <ion-icon :icon="ticketOutline"></ion-icon>
          </div>

          <div class="voucher-info">
            <h4>{{ v.name }}</h4>
            <p>{{ v.qty }}x • s/d {{ v.expired }}</p>
          </div>

          <button class="btn-use" @click="useVoucher(v)">
            Pakai
          </button>
        </div>

        <h4 class="section-title" style="margin-top: 24px;">
          Tukarkan Poin
        </h4>

        <!-- LIST VOUCHER -->
        <div v-for="item in vouchers" :key="item.name" class="voucher-card">
          <div class="voucher-icon-box" :class="item.color">
            <ion-icon :icon="item.icon"></ion-icon>
          </div>

          <div class="voucher-info">
            <h4>{{ item.name }}</h4>
            <p>{{ item.desc }}</p>
            <span class="voucher-price">
              {{ item.price }} Poin
            </span>
          </div>

          <button class="btn-redeem" @click="redeem(item)">
            Tukar
          </button>
        </div>
      </div>

      <!-- ================= RIWAYAT ================= -->
      <div v-if="selectedTab === 'riwayat'" class="tab-content">
        <h4 class="section-title">
          Riwayat Pemakaian & Perolehan
        </h4>

        <div class="history-list">

          <div v-for="(h, i) in histories" :key="i" class="history-item">
            <div class="history-icon" :class="h.point > 0 ? 'bg-light-green' : 'bg-light-red'">
              <ion-icon :icon="h.point > 0 ? arrowUpOutline : arrowDownOutline"></ion-icon>
            </div>

            <div class="history-info">
              <h4>{{ h.title }}</h4>
              <p>{{ h.date }}</p>
            </div>

            <div class="history-point" :class="h.point > 0 ? 'positive' : 'negative'">
              {{ h.point > 0 ? '+' : '' }}{{ h.point }}
            </div>
          </div>

        </div>
      </div>

      <!-- ================= PERINGKAT ================= -->
      <div v-if="selectedTab === 'peringkat'" class="tab-content">
        <h4 class="section-title">Papan Peringkat</h4>

        <div class="leaderboard-list">

          <div v-for="(u, i) in leaderboard" :key="u.name" class="leaderboard-item" :class="{
            'top-1': i === 0,
            'top-2': i === 1,
            'top-3': i === 2
          }">
            <div class="rank-badge">
              {{ i + 1 }}
            </div>

            <div class="user-avatar">
              <img :src="`https://ui-avatars.com/api/?name=${u.name}`" />
            </div>

            <div class="user-info">
              <h4>{{ u.name }}</h4>
              <p>{{ u.kelas }}</p>
            </div>

            <div class="user-point">
              {{ u.point }}
              <ion-icon :icon="star"></ion-icon>
            </div>
          </div>

        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonIcon,
  IonSegment, IonSegmentButton, IonLabel, toastController
} from '@ionic/vue'
import {
  arrowBack, star, timeOutline,
  arrowDownOutline, arrowUpOutline, ticketOutline
} from 'ionicons/icons'
import api from '../services/api'

const router = useRouter()

const selectedTab = ref('voucher')
const totalPoint = ref(0)

// state
const ownedVouchers = ref([])
const vouchers = ref([])
const histories = ref([])
const leaderboard = ref([])

const goBack = () => {
  router.replace('/home')
}

// 🚀 FETCH DATA (FIXED)
const fetchData = async () => {
  try {
    // 🔹 POINT
    const pointRes = await api.get('/point/my')
    totalPoint.value = pointRes.data.point || 0

    // 🔹 OWNED TOKEN
    const tokenRes = await api.get('/token/my')
    ownedVouchers.value = tokenRes.data.data.map(t => ({
      id: t.id,
      name: t.type === 'LATE' ? 'Bebas Terlambat' : t.type,
      expired: t.expired_at || '-',
      qty: t.qty || 1
    }))

    // 🔹 TOKEN ITEMS
    const itemRes = await api.get('/token/items')
    vouchers.value = itemRes.data.data.map(item => ({
      id: item.id,
      name: item.item_name,
      desc: item.description,
      price: item.point_cost,
      icon: timeOutline,
      color: 'bg-orange'
    }))

    // 🔹 HISTORY
    const historyRes = await api.get('/point/history')
    histories.value = historyRes.data.data.map(h => ({
      title: h.description,
      date: new Date(h.created_at).toLocaleDateString(),
      point: h.amount
    }))

    // 🔹 LEADERBOARD
    const leaderRes = await api.get('/point/leaderboard')
    leaderboard.value = leaderRes.data.data.map(u => ({
      name: u.name,
      kelas: u.kelas || '-',
      point: u.point
    }))

  } catch (err) {
    toast('Gagal ambil data 😢', 'danger')
    console.error(err)
  }
}

onMounted(fetchData)


// 🎯 REDEEM
const redeem = async (item) => {
  try {
    await api.post('/token/buy', {
      item_id: item.id
    })

    toast(`Berhasil tukar ${item.name}`)
    fetchData()

  } catch (e) {
    toast(e.response?.data?.message || 'Gagal tukar', 'danger')
  }
}


// 🎯 USE VOUCHER (lu tadi manggil tapi ga ada)
const useVoucher = async (voucher) => {
  try {
    await api.post(`/token/use/${voucher.id}`)

    toast(`Voucher ${voucher.name} dipakai`)
    fetchData()

  } catch (e) {
    toast(e.response?.data?.message || 'Gagal pakai voucher', 'danger')
  }
}


// 🎯 TOAST
const toast = async (msg, color = 'success') => {
  const t = await toastController.create({
    message: msg,
    duration: 1500,
    color,
    position: 'top'
  })
  t.present()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.custom-header {
  --background: #e53935;
  padding: 10px 0;
}

.header-content {
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 15px;
}

.back-icon {
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.header-content h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.bg-light {
  --background: #f4f7f6;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: #e53935;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 0;
}

.point-summary-card {
  background: white;
  margin: 20px 20px;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(229, 57, 53, 0.15);
  border: 2px solid #e53935;
  text-align: center;
}

.point-label {
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.point-value {
  font-size: 42px;
  font-weight: 800;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}

.point-icon {
  color: #fbbf24;
}

.point-desc {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
}

.segment-container {
  padding: 0 20px;
  margin-bottom: 20px;
}

.custom-segment {
  background: white;
  border-radius: 12px;
  padding: 4px;
}

ion-segment-button {
  --color: #6b7280;
  --color-checked: #e53935;
  --indicator-color: #fee2e2;
  font-weight: 600;
}

.tab-content {
  padding: 0 20px 40px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

/* Voucher Cards */
.voucher-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.voucher-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
}

.bg-orange {
  background: #f59e0b;
}

.bg-red {
  background: #ef4444;
}

.bg-purple {
  background: #8b5cf6;
}

.voucher-info {
  flex: 1;
}

.voucher-info h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.voucher-info p {
  margin: 0 0 6px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.3;
}

.voucher-price {
  font-size: 12px;
  font-weight: 800;
  color: #e53935;
  background: #fee2e2;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
}

.btn-redeem {
  background: #e53935;
  color: white;
  border: none;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-redeem:active {
  opacity: 0.8;
}

.btn-use {
  background: #10b981;
  color: white;
  border: none;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-use:active {
  opacity: 0.8;
}

/* History List */
.history-list {
  background: white;
  border-radius: 16px;
  padding: 8px 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.history-item:last-child {
  border-bottom: none;
}

.history-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.bg-light-red {
  background: #fee2e2;
  color: #ef4444;
}

.bg-light-green {
  background: #d1fae5;
  color: #10b981;
}

.history-info {
  flex: 1;
}

.history-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.history-info p {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.history-point {
  font-weight: 800;
  font-size: 15px;
}

.history-point.negative {
  color: #ef4444;
}

.history-point.positive {
  color: #10b981;
}

/* Leaderboard */
.leaderboard-list {
  background: white;
  border-radius: 16px;
  padding: 8px 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.leaderboard-item:last-child {
  border-bottom: none;
}

.rank-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 800;
  color: #6b7280;
  background: #f3f4f6;
}

.top-1 .rank-badge {
  background: #fef08a;
  color: #ca8a04;
}

.top-2 .rank-badge {
  background: #e5e7eb;
  color: #4b5563;
}

.top-3 .rank-badge {
  background: #fed7aa;
  color: #c2410c;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.user-info p {
  margin: 0;
  font-size: 11px;
  color: #9ca3af;
}

.user-point {
  font-weight: 800;
  font-size: 15px;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 4px;
}

.point-icon-small {
  color: #fbbf24;
  font-size: 16px;
}
</style>
