<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="/guru" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Laporan Absensi</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <div class="filter-card">
        <div class="filter-header">
          <h3>Filter Rekapitulasi</h3>
        </div>
        <div class="filter-body">
          <div class="form-group">
            <label>Pilih Kelas</label>
            <select class="custom-select" v-model="selectedClass">
              <option value="XII RPL 2">XII RPL 2</option>
              <option value="XI PPLG 2">XI PPLG 2</option>
              <option value="X AKL">X AKL</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Pilih Bulan</label>
            <select class="custom-select" v-model="selectedMonth">
              <option value="Oktober 2026">Oktober 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="Agustus 2026">Agustus 2026</option>
            </select>
          </div>
        </div>

        <button class="export-btn" @click="exportToExcel">
          <ion-icon :icon="downloadOutline"></ion-icon>
          <span>Export ke Excel</span>
        </button>
      </div>

      <!-- Preview Data -->
      <div class="preview-container">
        <div class="preview-header">
          <h4>Preview Data ({{ selectedClass }})</h4>
          <span class="total-student">{{ studentData.length }} Siswa</span>
        </div>

        <div class="student-list">
          <div 
            class="student-item" 
            v-for="(student, index) in studentData" 
            :key="index"
          >
            <div class="student-info">
              <span class="student-name">{{ student.Nama }}</span>
              <span class="student-nisn">{{ student.NISN }}</span>
            </div>
            
            <div class="student-stats">
              <div class="stat-badge hadir" title="Hadir">H: {{ student.Hadir }}</div>
              <div class="stat-badge sakit" title="Sakit">S: {{ student.Sakit }}</div>
              <div class="stat-badge izin" title="Izin">I: {{ student.Izin }}</div>
              <div class="stat-badge alfa" title="Alfa">A: {{ student.Alfa }}</div>
            </div>
          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonContent, IonIcon
} from '@ionic/vue'
import { downloadOutline } from 'ionicons/icons'
import * as XLSX from 'xlsx'

const selectedClass = ref('XII RPL 2')
const selectedMonth = ref('Oktober 2026')

// Dummy data for exporting
const studentData = ref([
  { NISN: '0041234567', Nama: 'Egiluy', Hadir: 20, Sakit: 1, Izin: 0, Alfa: 0 },
  { NISN: '0041234568', Nama: 'Ahmad Dani', Hadir: 19, Sakit: 0, Izin: 1, Alfa: 1 },
  { NISN: '0041234569', Nama: 'Budi Santoso', Hadir: 21, Sakit: 0, Izin: 0, Alfa: 0 },
  { NISN: '0041234570', Nama: 'Cici Pertiwi', Hadir: 18, Sakit: 2, Izin: 0, Alfa: 1 },
  { NISN: '0041234571', Nama: 'Deni Mubarok', Hadir: 20, Sakit: 0, Izin: 1, Alfa: 0 },
  { NISN: '0041234572', Nama: 'Rina Wijaya', Hadir: 21, Sakit: 0, Izin: 0, Alfa: 0 },
])

const exportToExcel = () => {
  // Convert JSON to Worksheet
  const worksheet = XLSX.utils.json_to_sheet(studentData.value)
  
  // Customizing Header width
  const wscols = [
    {wch: 15}, // NISN
    {wch: 25}, // Nama
    {wch: 8},  // Hadir
    {wch: 8},  // Sakit
    {wch: 8},  // Izin
    {wch: 8}   // Alfa
  ]
  worksheet['!cols'] = wscols
  
  // Create Workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "RekapAbsensi")
  
  // Format File Name
  const fileName = `Rekap_Absensi_${selectedClass.value.replace(/ /g, '_')}_${selectedMonth.value.split(' ')[0]}.xlsx`
  
  // Export & Download
  XLSX.writeFile(workbook, fileName)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.custom-header {
  --background: #e53935;
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
  height: 120px;
  background: #e53935;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  z-index: 0;
}

.filter-card {
  position: relative;
  z-index: 10;
  background: white;
  margin: 20px 20px;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.filter-header h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.filter-body {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
}

.custom-select {
  width: 100%;
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  background: #f9fafb;
  outline: none;
}

.custom-select:focus {
  border-color: #e53935;
  background: white;
}

.export-btn {
  width: 100%;
  height: 48px;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 15px rgba(229, 57, 53, 0.3);
  transition: transform 0.2s;
  cursor: pointer;
}

.export-btn:active {
  transform: scale(0.97);
}

.export-btn ion-icon {
  font-size: 20px;
}

/* Preview Data */
.preview-container {
  padding: 0 20px 40px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.total-student {
  font-size: 13px;
  color: #e53935;
  font-weight: 700;
  background: #fdecea;
  padding: 4px 10px;
  border-radius: 100px;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.student-item {
  background: white;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2px;
}

.student-nisn {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
}

.student-stats {
  display: flex;
  gap: 6px;
}

.stat-badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
}

.stat-badge.hadir { background: #d1fae5; color: #10b981; }
.stat-badge.sakit { background: #fef3c7; color: #f59e0b; }
.stat-badge.izin { background: #dbeafe; color: #2563eb; }
.stat-badge.alfa { background: #fee2e2; color: #ef4444; }
</style>
