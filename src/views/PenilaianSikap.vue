<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/guru" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Penilaian Sikap</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="goToRekap" color="light">
            <ion-icon :icon="statsChartOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">

      <ion-refresher slot="fixed" @ionRefresh="doRefresh">
        <ion-refresher-content pulling-text="Tarik untuk refresh" refreshing-spinner="circles"
          refreshing-text="Memuat ulang...">
        </ion-refresher-content>
      </ion-refresher>
      <div class="header-bg"></div>

      <div class="main-container">

        <!-- INFO DASHBOARD (Filter & Title) -->
        <div class="filter-card">
          <h2 class="db-title">Dashboard Penilaian Sikap</h2>
          <p class="db-subtitle">Kelola dan pantau progres evaluasi bawahan / siswa</p>

          <div class="filter-flex mt-4">
            <div class="input-group">
              <label>Periode Evaluasi</label>
              <select v-model="selectedPeriod" class="custom-select">
                <option v-for="moon in pastMonths" :key="moon.value" :value="moon.value">{{ moon.label }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>Pilih Kelas</label>
              <select v-model="selectedClass" @change="onClassChange" class="custom-select">
                <option value="" disabled>-- Pilih Kelas --</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.nama_kelas }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="progress-section" v-if="selectedClass">
          <div class="prog-header">
            <h4>Progres Bulan Ini</h4>
            <span>{{ evaluatedCount }} / {{ studentsList.length }} Orang Dinilai</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <p class="prog-text">
            Anda telah menilai <strong>{{ evaluatedCount }}</strong> dari <strong>{{ studentsList.length }}</strong>
            staf/siswa di kelas ini.
            <span v-if="progressPercent === 100" class="text-success ml-1">Selesai! 🎉</span>
          </p>
        </div>

        <!-- DAFTAR SISWA -->
        <div class="students-grid" v-if="selectedClass">
          <div v-for="(student, index) in studentsList" :key="student.id" class="student-card"
            :class="{ 'is-done': student.isEvaluated }" @click="openModal(student, index)">
            <div class="stu-avatar">
              <img
                :src="`https://ui-avatars.com/api/?name=${student.name}&background=${student.isEvaluated ? '10b981' : 'e2e8f0'}&color=${student.isEvaluated ? 'fff' : '64748b'}`"
                alt="Avatar" />
              <div class="check-badge" v-if="student.isEvaluated">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
              </div>
            </div>
            <div class="stu-info">
              <h4>{{ student.name }}</h4>
              <p>ID: 10{{ student.id }}0</p>
              <div class="badge-wrapper">
                <span class="status-badge" :class="student.isEvaluated ? 'b-green' : 'b-yellow'">
                  {{ student.isEvaluated ? 'Sudah Dinilai' : 'Belum Dinilai' }}
                </span>
              </div>
            </div>
            <div class="stu-action">
              <ion-icon :icon="chevronForwardOutline"></ion-icon>
            </div>
          </div>
        </div>

        <div class="empty-state" v-if="!selectedClass">
          <p>Silakan pilih Periode dan Kelas di atas untuk mulai melihat siswa Anda.</p>
        </div>

      </div>
    </ion-content>

    <!-- MODAL POP-UP PENILAIAN -->
    <div class="modal-backdrop" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Form Evaluasi Diri</h3>
          <button class="close-btn" @click="closeModal"><ion-icon :icon="closeOutline"></ion-icon></button>
        </div>

        <div class="modal-body" v-if="activeStudent">
          <div class="user-profile">
            <div class="big-avatar">
              <img :src="`https://ui-avatars.com/api/?name=${activeStudent.name}&background=f8fafc&color=334155`"
                alt="Avatar" />
            </div>
            <div class="user-meta">
              <h2 class="u-name">{{ activeStudent.name }}</h2>
              <p class="u-class">{{ selectedClass }} | Periode: {{ getPeriodLabel(selectedPeriod) }}</p>
            </div>
          </div>

          <!-- INDIKATOR PERTANYAAN SLIDER / STAR -->
          <div class="indicators-list">
            <div class="indicator-item" v-for="(q, qIndex) in categories" :key="qIndex">
              <div class="ind-head">

                <div class="question-text">
                  <p class="q-title">
                    {{ qIndex + 1 }}. {{ q.name }}
                  </p>

                  <p class="q-desc">
                    {{ q.description }}
                  </p>
                </div>

                <span class="rating-label">
                  {{ getRatingLabel(ratings[qIndex]) }}
                </span>

              </div>
              <div class="star-rating">
                <ion-icon v-for="star in 5" :key="star" :icon="star <= ratings[qIndex] ? starFull : starOutline"
                  class="star-btn" :class="{ active: star <= ratings[qIndex] }"
                  @click="ratings[qIndex] = star"></ion-icon>
              </div>
            </div>
          </div>

          <div class="feedback-container">
            <label>Catatan / Feedback (Wajib / Opsional)</label>
            <textarea v-model="feedbackText"
              placeholder="Berikan saran atau apresiasi terkait perkembangan bawahan/siswa ini..." rows="3"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-save" @click="saveEvaluation(false)" :disabled="isSubmitting">
            <span v-if="isSubmitting">Proses...</span>
            <span v-else>Simpan</span>
          </button>

          <button class="btn-save-next" @click="saveEvaluation(true)" :disabled="isSubmitting || !hasNextStudent">
            <span>Simpan & Lanjut </span>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonIcon, IonButton,
  IonRefresher, IonRefresherContent
} from '@ionic/vue'

import { useRouter } from 'vue-router'

import {
  statsChartOutline,
  closeOutline,
  star as starFull,
  starOutline,
  arrowForwardOutline,
  checkmarkCircle,
  chevronForwardOutline
} from 'ionicons/icons'

import api from '../services/api'

const router = useRouter()

/* ===============================
PERIODE
================================ */

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

const selectedPeriod = ref('')

const getPeriodLabel = (val) => {
  const fd = pastMonths.value.find(m => m.value === val)
  return fd ? fd.label : val
}

/* ===============================
DATA API
================================ */

const classes = ref([])
const studentsList = ref([])
const categories = ref([])

const tahunAjarId = ref(null)

const selectedClass = ref('')

/* ===============================
LOAD DATA
================================ */

const loadTahunAjar = async () => {
  const res = await api.get('tahun-ajar')

  const aktif = res.data.data.find(t => t.aktif)

  tahunAjarId.value = aktif.id
}

const loadClasses = async () => {
  const res = await api.post('kelas', {
    tahun_ajar_id: tahunAjarId.value
  })

  classes.value = res.data.data
}

const loadCategories = async () => {
  const res = await api.get('assessment-categories')

  categories.value = res.data.data
}

const onClassChange = async () => {

  const res = await api.get(
    `murid-kelas/${selectedClass.value}?period=${selectedPeriod.value.slice(0, 7)}`
  )

  studentsList.value = res.data.data
}

/* ===============================
PROGRESS
================================ */

const evaluatedCount = computed(() => {
  return studentsList.value.filter(s => s.isEvaluated).length
})

const progressPercent = computed(() => {

  if (!studentsList.value.length) return 0

  return Math.round(
    evaluatedCount.value / studentsList.value.length * 100
  )
})

/* ===============================
MODAL
================================ */

const showModal = ref(false)

const activeStudent = ref(null)

const activeIndex = ref(-1)

const ratings = ref([])

const feedbackText = ref('')

const isSubmitting = ref(false)

const openModal = (student, index) => {

  activeStudent.value = student

  activeIndex.value = index

  ratings.value = new Array(categories.value.length).fill(0)

  feedbackText.value = ''

  showModal.value = true
}

const closeModal = () => {

  showModal.value = false

  activeStudent.value = null

  activeIndex.value = -1
}

const hasNextStudent = computed(() => {

  return activeIndex.value < studentsList.value.length - 1
})

/* ===============================
RATING LABEL
================================ */

const getRatingLabel = (val) => {

  if (val === 5) return 'Sangat Baik (5)'
  if (val === 4) return 'Baik (4)'
  if (val === 3) return 'Cukup (3)'
  if (val === 2) return 'Kurang (2)'
  if (val === 1) return 'Sangat Kurang (1)'

  return 'Belum Dinilai'
}

/* ===============================
SIMPAN NILAI
================================ */

const saveEvaluation = async (goToNext) => {

  const isComplete = ratings.value.every(r => r > 0)

  if (!isComplete) {
    alert("Semua indikator harus dinilai")
    return
  }

  isSubmitting.value = true

  try {

    const scores = categories.value.map((c, i) => ({
      category_id: c.id,
      score: ratings.value[i]
    }))

    const payload = {

      evaluatee_id: activeStudent.value.id,

      period: selectedPeriod.value.slice(0, 7),

      general_notes: feedbackText.value,

      scores: scores
    }

    await api.post('assessment', payload)

    studentsList.value[activeIndex.value].isEvaluated = true

    if (goToNext && hasNextStudent.value) {

      const nextIndex = activeIndex.value + 1

      openModal(studentsList.value[nextIndex], nextIndex)

    } else {

      closeModal()

    }

  } catch (err) {

    alert(err.response?.data?.message || "Gagal menyimpan")

  } finally {

    isSubmitting.value = false
  }
}

/* ===============================
NAVIGATION
================================ */

const goToRekap = () => {

  router.push('/rekap-sikap')
}

/* ===============================
INIT
================================ */

onMounted(async () => {

  selectedPeriod.value = pastMonths.value[0].value

  await loadTahunAjar()

  await loadClasses()

  await loadCategories()
})

const doRefresh = async (event) => {

  try {

    await loadClasses()
    await loadCategories()

    if (selectedClass.value) {
      await onClassChange()
    }

  } catch (err) {
    console.error(err)
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

.ml-1 {
  margin-left: 5px;
}

.text-success {
  color: #10b981;
  font-weight: 800;
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

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
}

.custom-select {
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

/* PROGRESS BAR */
.progress-section {
  background: white;
  margin-top: 20px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
}

.prog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.prog-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
}

.prog-header span {
  font-size: 13px;
  font-weight: 700;
  color: #10b981;
  background: #d1fae5;
  padding: 3px 10px;
  border-radius: 100px;
}

.progress-track {
  height: 10px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 10px;
  transition: width 0.5s ease-out;
}

.prog-text {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

/* STUDENT GRID/LIST */
.students-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media(min-width: 768px) {
  .students-grid {
    grid-template-columns: 1fr 1fr;
  }

  .filter-flex {
    flex-direction: row;
  }
}

@media(max-width: 767px) {
  .filter-flex {
    flex-direction: column;
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

.student-card.is-done {
  background: #fafafa;
  border-color: #f1f5f9;
}

.stu-avatar {
  position: relative;
  width: 50px;
  height: 50px;
}

.stu-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.check-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: white;
  color: #10b981;
  border-radius: 50%;
  font-size: 18px;
  display: flex;
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
  margin: 0 0 8px;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.badge-wrapper {
  display: flex;
}

.status-badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
}

.b-yellow {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.b-green {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.stu-action {
  color: #cbd5e1;
  font-size: 20px;
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
  /* 85% of screen height */
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

/* INDICATORS (STARS) */
.indicators-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.indicator-item {
  background: white;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.ind-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.q-text {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

.rating-label {
  font-size: 11px;
  font-weight: 800;
  color: #8b5cf6;
  background: #ede9fe;
  padding: 3px 10px;
  border-radius: 100px;
}

.star-rating {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.star-btn {
  font-size: 32px;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
}

.star-btn:active {
  transform: scale(0.8);
}

.star-btn.active {
  color: #f59e0b;
}

/* FEEDBACK AREA */
.feedback-container {
  background: white;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.feedback-container label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 10px;
}

.feedback-container textarea {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  color: #334155;
  outline: none;
  resize: vertical;
}

.feedback-container textarea:focus {
  border-color: #3b82f6;
}

/* MODAL FOOTER BUTTONS */
.modal-footer {
  padding: 20px;
  background: white;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 10px;
}

.btn-save,
.btn-save-next {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-save {
  background: #f1f5f9;
  color: #475569;
}

.btn-save:hover {
  background: #e2e8f0;
}

.btn-save-next {
  background: #e53935;
  color: white;
  flex: 1.5;
}

.btn-save-next:hover {
  background: #b91c1c;
}

.btn-save:disabled,
.btn-save-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
