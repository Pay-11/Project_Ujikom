<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="custom-header">
        <ion-buttons slot="start">
          <ion-back-button default-href="profile-guru" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Keamanan Akun</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-light">
      <div class="header-bg"></div>

      <div class="security-container">
        <!-- Security Header Icon -->
        <div class="security-icon-wrapper">
          <div class="icon-circle">
            <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
          </div>
          <h2 class="page-title">Ubah Kata Sandi</h2>
          <p class="page-subtitle">Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat.</p>
        </div>

        <!-- Change Password Form -->
        <div class="form-card">
          <form @submit.prevent="handleChangePassword">
            <div class="form-group">
              <label>Kata Sandi Saat Ini</label>
              <div class="input-wrapper">
                <ion-icon :icon="lockClosedOutline" class="input-icon"></ion-icon>
                <input 
                  type="password" 
                  v-model="form.current_password" 
                  placeholder="Masukkan kata sandi saat ini"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Kata Sandi Baru</label>
              <div class="input-wrapper">
                <ion-icon :icon="keyOutline" class="input-icon"></ion-icon>
                <input 
                  type="password" 
                  v-model="form.new_password" 
                  placeholder="Masukkan kata sandi baru"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Konfirmasi Kata Sandi Baru</label>
              <div class="input-wrapper">
                <ion-icon :icon="checkmarkCircleOutline" class="input-icon"></ion-icon>
                <input 
                  type="password" 
                  v-model="form.new_password_confirmation" 
                  placeholder="Ulangi kata sandi baru"
                  required
                />
              </div>
            </div>

            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">Simpan Perubahan</span>
              <ion-spinner name="crescent" v-else class="btn-spinner"></ion-spinner>
            </button>
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonTitle, IonContent, IonIcon, IonSpinner, toastController
} from '@ionic/vue'
import {
  shieldCheckmarkOutline, lockClosedOutline, keyOutline, checkmarkCircleOutline
} from 'ionicons/icons'
import { ref } from 'vue'
import api from '@/services/api'

const isLoading = ref(false)
const form = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const showToast = async (message, color = 'success') => {
  const toast = await toastController.create({
    message,
    duration: 3000,
    color,
    position: 'top',
    cssClass: 'custom-toast'
  })
  return toast.present()
}

const handleChangePassword = async () => {
  if (form.value.new_password !== form.value.new_password_confirmation) {
    showToast('Konfirmasi kata sandi baru tidak cocok', 'danger')
    return
  }

  isLoading.value = true
  try {
    // Sesuaikan endpoint ini dengan backend Anda
    const res = await api.post('/change-password', form.value)
    showToast(res.data.message || 'Kata sandi berhasil diubah')
    form.value = {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    }
  } catch (err) {
    console.error(err)
    if (err.response && err.response.data && err.response.data.message) {
      showToast(err.response.data.message, 'danger')
    } else {
      showToast('Gagal mengubah kata sandi', 'danger')
    }
  } finally {
    isLoading.value = false
  }
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

.security-container {
  position: relative;
  z-index: 10;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.security-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 10px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 16px rgba(229, 57, 53, 0.2);
  margin-bottom: 16px;
  color: #e53935;
  font-size: 40px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  max-width: 280px;
  line-height: 1.5;
}

.form-card {
  background: white;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 20px;
  color: #9ca3af;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 46px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  transition: all 0.2s;
  background: #f9fafb;
}

.input-wrapper input:focus {
  border-color: #e53935;
  background: white;
  box-shadow: 0 0 0 4px rgba(229, 57, 53, 0.1);
}

.btn-submit {
  width: 100%;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.2s;
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.2);
}

.btn-submit:hover {
  background: #d32f2f;
}

.btn-submit:active {
  transform: scale(0.98);
}

.btn-spinner {
  color: white;
  width: 24px;
  height: 24px;
}

/* Fix custom toast styling overriding ionic variables if needed */
::v-deep(.custom-toast) {
  --border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}
</style>
