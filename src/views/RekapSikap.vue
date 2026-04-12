<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/guru" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Rekap Nilai Sikap</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <ion-refresher slot="fixed" @ionRefresh="doRefresh">
        <ion-refresher-content pulling-text="Tarik untuk refresh" refreshing-spinner="circles"
          refreshing-text="Memuat ulang...">
        </ion-refresher-content>
      </ion-refresher>

      <ion-content class="bg-light">



        <div class="header-bg"></div>

        <div class="main-container">

          <!-- DASHBOARD FILTER -->
          <div class="filter-card">
            <h2 class="db-title">Rekap Penilaian Sikap</h2>
            <p class="db-subtitle">Lihat hasil evaluasi siswa</p>

            <div class="filter-flex mt-4">

              <!-- PERIODE -->
              <div class="input-group">
                <label>Periode Evaluasi</label>
                <select v-model="selectedPeriod" class="custom-select">
                  <option v-for="moon in pastMonths" :key="moon.value" :value="moon.value">
                    {{ moon.label }}
                  </option>
                </select>
              </div>

              <!-- KELAS -->
              <div class="input-group">
                <label>Pilih Kelas</label>
                <select v-model="selectedClass" @change="loadStudents" class="custom-select">
                  <option value="" disabled>-- Pilih Kelas --</option>

                  <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                    {{ cls.nama_kelas }}
                  </option>

                </select>
              </div>

            </div>
          </div>

          <!-- STUDENTS LIST -->

          <div class="students-grid mt-4" v-if="filteredStudents.length > 0">

            <div v-for="student in filteredStudents" :key="student.id" class="student-card" @click="openModal(student)">

              <div class="stu-avatar">
                <img :src="`https://ui-avatars.com/api/?name=${student.name}&background=e2e8f0&color=64748b`" />
              </div>

              <div class="stu-info">
                <h4>{{ student.name }}</h4>
                <p>{{ student.class_name }}</p>
              </div>

              <div class="stu-action">
                <button class="view-btn">
                  Lihat Rapor
                </button>
              </div>

            </div>

          </div>

          <!-- EMPTY -->

          <div class="empty-state" v-else>
            Belum ada staf/bawahan yang dapat ditampilkan.
          </div>

        </div>

      </ion-content>

      <!-- MODAL -->

      <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">

        <div class="modal-content">

          <div class="modal-header">
            <h3>Rapor Evaluasi Bulanan</h3>

            <button class="close-btn" @click="closeModal">
              <ion-icon :icon="closeOutline" />
            </button>

          </div>

          <div class="modal-body" v-if="activeStudent">

            <!-- PROFILE -->

            <div class="user-profile">

              <div class="big-avatar">
                <img :src="`https://ui-avatars.com/api/?name=${activeStudent.name}`" />
              </div>

              <div class="user-meta">
                <h2 class="u-name">
                  {{ activeStudent.name }}
                </h2>

                <p class="u-class">
                  {{ activeStudent.class_name }} |
                  ID: 10{{ activeStudent.id }}0
                </p>
              </div>

            </div>

            <div class="analysis-box">

              <h3>Analisis Nilai</h3>

              <p class="overall">
                Rata-rata keseluruhan:
                <b>{{ overallAverage }}</b>
              </p>

              <canvas id="radarChart"></canvas>

              <div class="category-list">

                <div v-for="cat in categoryAverages" :key="cat.category" class="cat-row">
                  <span>{{ cat.category }}</span>
                  <b>{{ cat.avg }}</b>
                </div>

              </div>

            </div>

            <!-- HISTORY -->

            <div class="timeline-container">

              <div v-if="historyData.length === 0" class="empty-state" style="margin-top:0">
                Belum ada riwayat nilai
              </div>

              <div v-else class="timeline-item" v-for="(hist, idx) in historyData" :key="idx">

                <div class="timeline-dot" :class="getDotClass(hist.sikap)" />

                <div class="timeline-line" v-if="idx !== historyData.length - 1" />

                <div class="timeline-content">

                  <div class="hist-header">

                    <span class="hist-date">
                      {{ hist.period_label }}
                    </span>

                    <span class="badge" :class="getBadgeClass(hist.sikap)">
                      {{ hist.sikap }}
                    </span>

                  </div>

                  <div class="feedback-box" v-if="hist.keterangan">
                    "{{ hist.keterangan }}"
                  </div>

                  <div class="feedback-box empty-feedback" v-else>
                    Tidak ada catatan tambahan
                  </div>

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

import { ref, computed, onMounted } from "vue"
import api from "../services/api"
import Chart from "chart.js/auto"

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonRefresher,
  IonRefresherContent,
  IonIcon
} from "@ionic/vue"

import { closeOutline } from "ionicons/icons"


const classes = ref([])
const studentsList = ref([])
const selectedClass = ref("")
const tahunAjarId = ref(null)

const historyData = ref([])

const showModal = ref(false)
const activeStudent = ref(null)
const selectedPeriod = ref('')

const categoryAverages = ref([])
const overallAverage = ref(0)

let radarChart = null

const renderChart = () => {

  const ctx = document.getElementById("radarChart")

  if (!ctx) return

  if (radarChart) radarChart.destroy()

  radarChart = new Chart(ctx, {

    type: "radar",

    data: {

      labels: categoryAverages.value.map(c => c.category),

      datasets: [
        {
          label: "Nilai Sikap",
          data: categoryAverages.value.map(c => c.avg),
          fill: true
        }
      ]

    },

    options: {

      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 5
        }
      }

    }

  })

}


const pastMonths = computed(() => {

  const months = []
  const date = new Date()

  const formatOpt = { month: 'long', year: 'numeric' }

  for (let i = 0; i < 4; i++) {

    const d = new Date(date.getFullYear(), date.getMonth() - i, 1)

    const label = d.toLocaleDateString('id-ID', formatOpt)

    const valueStr =
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-01`

    months.push({
      label,
      value: valueStr
    })

  }

  return months
})

const loadStudents = async () => {

  if (!selectedClass.value || !selectedPeriod.value) return

  const res = await api.get(
    `murid-kelas/${selectedClass.value}?period=${selectedPeriod.value.slice(0, 7)}`
  )

  studentsList.value = res.data.data.map(s => ({
    ...s,
    class_name: classes.value.find(c => c.id == selectedClass.value)?.nama_kelas
  }))
}






const loadTahunAjar = async () => {

  const res = await api.get("tahun-ajar")

  const aktif = res.data.data.find(t => t.aktif)

  tahunAjarId.value = aktif.id

}



const loadClasses = async () => {

  const res = await api.post("kelas", {
    tahun_ajar_id: tahunAjarId.value
  })

  classes.value = res.data.data

}



const onClassChange = async () => {

  const res = await api.get(
    `murid-kelas/${selectedClass.value}?period=2026-03`
  )

  studentsList.value = res.data.data.map(s => ({
    ...s,
    class_name:
      classes.value.find(c => c.id == selectedClass.value)?.nama_kelas
  }))

}



const filteredStudents = computed(() => {

  if (!selectedClass.value) return []

  return studentsList.value

})



const openModal = async (student) => {

  activeStudent.value = student

  const res = await api.get(
    `nilai-murid/${student.id}?period=${selectedPeriod.value.slice(0, 7)}`
  )

  const data = res.data.data

  if (data.length === 0) {
    historyData.value = []
    categoryAverages.value = []
    overallAverage.value = 0
    showModal.value = true
    return
  }

  const details = data[0].details

  const catMap = {}

  details.forEach(d => {

    if (!catMap[d.category.name]) {
      catMap[d.category.name] = []
    }

    catMap[d.category.name].push(d.score)

  })

  categoryAverages.value = Object.keys(catMap).map(name => {

    const scores = catMap[name]

    const avg =
      scores.reduce((a, b) => a + b, 0) / scores.length

    return {
      category: name,
      avg: Number(avg.toFixed(2))
    }

  })

  overallAverage.value =
    categoryAverages.value.reduce((a, b) => a + b.avg, 0) /
    categoryAverages.value.length

  overallAverage.value = Number(overallAverage.value.toFixed(2))

  historyData.value = data.map(item => {

    const avg =
      item.details.reduce((a, b) => a + b.score, 0) /
      item.details.length

    let sikap = "Cukup"

    if (avg >= 4.5) sikap = "Sangat Baik"
    else if (avg >= 3.5) sikap = "Baik"
    else if (avg >= 2.5) sikap = "Cukup"
    else sikap = "Kurang"

    return {
      period_label: item.period,
      sikap,
      keterangan: item.general_notes
    }

  })

  showModal.value = true

  setTimeout(renderChart, 200)

}



const closeModal = () => {

  showModal.value = false
  activeStudent.value = null
  historyData.value = []

}



const getBadgeClass = (sikap) => {

  if (sikap.includes("Baik")) return "b-green"
  if (sikap.includes("Cukup")) return "b-yellow"
  return "b-red"

}



const getDotClass = (sikap) => {

  if (sikap.includes("Baik")) return "dot-green"
  if (sikap.includes("Cukup")) return "dot-yellow"
  return "dot-red"

}



onMounted(async () => {

  selectedPeriod.value = pastMonths.value[0].value

  await loadTahunAjar()

  await loadClasses()

})

const doRefresh = async (event) => {

  await loadTahunAjar()
  await loadClasses()

  if (selectedClass.value) {
    await onClassChange()
  }

  event.target.complete()

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
  height: 90px;
  background: #e53935;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  z-index: 0;
}

.main-container {
  position: relative;
  z-index: 10;
  padding: 0 16px 40px;
}

.mt-4 {
  margin-top: 16px;
}

/* Dashboard Cards Filter */
.filter-card {
  background: white;
  margin-top: 15px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(229, 57, 53, 0.1);
}

.db-title {
  margin: 0 0 5px;
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}

.db-subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.filter-flex {
  display: flex;
  gap: 15px;
}

.input-group label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
  display: block;
}

.custom-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: #f8fafc;
  font-size: 14px;
  color: #334155;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}

/* STUDENT GRID/LIST */
.students-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media(min-width: 768px) {
  .students-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.student-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;
  transition: all 0.2s;
  cursor: pointer;
}

.student-card:active {
  transform: scale(0.98);
}

.student-card:hover {
  border-color: #cbd5e1;
}

.stu-avatar {
  width: 50px;
  height: 50px;
}

.stu-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.stu-info {
  flex: 1;
}

.stu-info h4 {
  margin: 0 0 3px;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.stu-info p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.stu-action .view-btn {
  background: #f1f5f9;
  color: #3b82f6;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.stu-action .view-btn:hover {
  background: #e2e8f0;
}

.empty-state {
  margin-top: 30px;
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 14px;
  border: 1px dashed #cbd5e1;
}

/* MODAL OVERLAY */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  /* Slides from bottom */
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 600px;
  height: 85vh;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8fafc;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  margin-bottom: 25px;
}

.big-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-meta .u-name {
  margin: 0 0 5px;
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.user-meta .u-class {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

/* TIMELINE STYLES DARI NILAISIKAPSISWA */
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

.dot-green {
  background: #10b981;
  box-shadow: 0 0 0 2px #d1fae5;
}

.dot-yellow {
  background: #f59e0b;
  box-shadow: 0 0 0 2px #fef3c7;
}

.dot-red {
  background: #ef4444;
  box-shadow: 0 0 0 2px #fee2e2;
}

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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
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

.b-green {
  background: #d1fae5;
  color: #10b981;
}

.b-yellow {
  background: #fef3c7;
  color: #f59e0b;
}

.b-red {
  background: #fee2e2;
  color: #ef4444;
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

.empty-feedback {
  background: transparent;
  padding: 0;
  border-left: none;
  font-style: normal;
}

.empty-feedback p {
  margin: 0;
  color: #94a3b8;
}

.analysis-box {
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.overall {
  font-size: 14px;
  margin-bottom: 10px;
}

.category-list {
  margin-top: 10px;
}

.cat-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
}
</style>
