// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';
import store from './store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

// Set base URL for Axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);

// Install router
app.use(router);
// Make store available in components
app.config.globalProperties.$store = store;
// Also expose axios directly if needed
app.config.globalProperties.$axios = axios;

app.mount('#app');

// -------------------------
// src/pages/RegisterPage.vue
<template>
  <div class="register-page container py-4">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Username</label>
          <input
            v-model="form.username"
            type="text"
            class="form-control"
            required
            minlength="3"
            maxlength="30"
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">First Name</label>
          <input
            v-model="form.firstname"
            type="text"
            class="form-control"
            required
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Last Name</label>
          <input
            v-model="form.lastname"
            type="text"
            class="form-control"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            required
            minlength="8"
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Country</label>
          <select
            v-model="form.country"
            class="form-select"
            required
          >
            <option value="" disabled>Choose a country…</option>
            <option
              v-for="c in countries"
              :key="c.code"
              :value="c.code"
            >
              {{ c.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Profile Picture URL (optional)</label>
        <input
          v-model="form.profilePic"
          type="url"
          class="form-control"
          placeholder="https://example.com/pic.jpg"
        />
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <button type="submit" class="btn btn-success">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';

export default {
  name: 'RegisterPage',
  data() {
    return {
      form: {
        username: '',
        firstname: '',
        lastname: '',
        country: '',
        password: '',
        email: '',
        profilePic: ''
      },
      // static list of countries
      countries: [
        { name: 'Australia', code: 'AU' },
        { name: 'Canada', code: 'CA' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'Israel', code: 'IL' },
        { name: 'United Kingdom', code: 'GB' },
        { name: 'United States', code: 'US' }
      ],
      error: null
    };
  },
  methods: {
    async register() {
      this.error = null;
      try {
        await axios.post(
          `${store.server_domain}/auth/Register`,
          this.form
        );
        this.$router.push({ name: 'LoginPage' });
      } catch (e) {
        this.error = e.response?.data?.message;
      }
    }
  }
};
</script>

<style scoped></style>
