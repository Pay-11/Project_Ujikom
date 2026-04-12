<template>   <ion-page>
    <ion-content class="login-content" :scroll-y="false">
      <div class="login-container">
        <!-- Background Decorations -->
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        
        <div class="glass-card">
          <div class="logo-container">
            <div class="logo-circle">
              <span class="logo-text">S</span>
            </div>
            <h1 class="brand-title">Sehadir</h1>
            <p class="brand-subtitle">Sistem Kehadiran Digital</p>
          </div>

          <!-- Role Toggle -->
          <div class="role-toggle">
            <div 
              class="toggle-btn" 
              :class="{ active: role === 'siswa' }" 
              @click="setRole('siswa')"
            >
              Siswa
            </div>
            <div 
              class="toggle-btn" 
              :class="{ active: role === 'guru' }" 
              @click="setRole('guru')"
            >
              Guru
            </div>
            <div class="toggle-slider" :class="'slide-' + role"></div>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div v-if="errorMessage" class="error-msg">
              {{ errorMessage }}
            </div>

            <div class="input-group">
              <label class="input-label">{{ role === 'siswa' ? 'NISN' : 'NIP' }}</label>
              <div class="input-wrapper">
                <input 
                  type="text" 
                  v-model="form.login" 
                  :placeholder="'Masukkan ' + (role === 'siswa' ? 'NISN' : 'NIP') + ' Anda'"
                  required
                />
                <div class="input-icon">
                  <ion-icon :icon="personOutline"></ion-icon>
                </div>
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Password</label>
              <div class="input-wrapper">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="form.password" 
                  placeholder="Masukkan Password"
                  required
                />
                <div class="input-icon">
                  <ion-icon :icon="lockClosedOutline"></ion-icon>
                </div>
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline"></ion-icon>
                </button>
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="!isLoading">Masuk</span>
              <ion-spinner v-else name="crescent"></ion-spinner>
            </button>
          </form>
          
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/vue';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import api from '../services/api';

const router = useRouter();

const role = ref('siswa'); // 'siswa' or 'guru'
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const form = ref({
  login: '',
  password: ''
});

// Reset form values when changing role
const setRole = (newRole) => {
  role.value = newRole;
  form.value.login = '';
  form.value.password = '';
  errorMessage.value = '';
};

const handleLogin = async () => {
  if (!form.value.login || !form.value.password) {
    errorMessage.value = "Silakan lengkapi data login Anda.";
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const res = await api.post("login", {
      login: form.value.login,
      password: form.value.password
    });

    const data = res.data;
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || {}));
    localStorage.setItem("role", role.value); // Simpan role login untuk keperluan frontend

    if (role.value === 'guru') {
      router.push("/guru");
    } else {
      router.push("/home");
    }
  } catch (err) {
    if (err.response && err.response.data) {
      errorMessage.value = err.response.data.message || "Kredensial yang Anda masukkan salah.";
    } else {
      errorMessage.value = "Login gagal. Periksa koneksi internet Anda.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

ion-content::part(background) {
  background: #f4f7f6;
}

* {
  font-family: 'Inter', sans-serif;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #910e0e 0%, #ffffff 100%);
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  right: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

.glass-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 40px 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255,255,255,0.5);
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  text-align: center;
  margin-bottom: 30px;
}

.logo-circle {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #e53935, #e02929);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 15px;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
  transform: rotate(10deg);
}

.logo-text {
  color: white;
  font-size: 36px;
  font-weight: 800;
  transform: rotate(-10deg);
}

.brand-title {
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 5px;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* Toggle role */
.role-toggle {
  display: flex;
  position: relative;
  background: #f3f4f6;
  border-radius: 100px;
  width: 100%;
  height: 50px;
  margin-bottom: 30px;
  padding: 5px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
}

.toggle-btn {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  font-weight: 600;
  font-size: 15px;
  color: #6b7280;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  color: #c92424;
}

.toggle-slider {
  position: absolute;
  top: 5px;
  left: 5px;
  width: calc(50% - 5px);
  height: calc(100% - 10px);
  background: white;
  border-radius: 100px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  z-index: 1;
}

.slide-siswa {
  transform: translateX(0);
}

.slide-guru {
  transform: translateX(100%);
}

.login-form {
  width: 100%;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  margin-left: 5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: #9ca3af;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  height: 52px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 0 20px 0 45px;
  font-size: 15px;
  color: #1f2937;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  background: #ffffff;
  border-color: #e53935;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.input-wrapper input::placeholder {
  color: #9ca3af;
}

.toggle-password {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #4b5563;
}



.error-msg {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 15px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #fecaca;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
}

.submit-btn {
  width: 100%;
  height: 54px;
  background: linear-gradient(135deg, #ff3434, #e53935);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.25);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(16, 185, 129, 0.35);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
</style>




