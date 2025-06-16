<template>
  <div class="login-page container py-4">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username">Username</label>
        <input v-model="credentials.username" id="username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password">Password</label>
        <input v-model="credentials.password" id="password" type="password" class="form-control" required />
      </div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <button class="btn btn-primary w-100">Login</button>
    </form>
    <p class="mt-3 text-center">
      Don't have an account? <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';

export default {
  name: 'LoginPage',
  data() {
    return {
      credentials: { username: '', password: '' },
      error: null
    };
  },
  methods: {
    async login() {
      this.error = null;
      try {
        await axios.post(
          `${store.server_domain}/auth/Login`,
          this.credentials,
          { withCredentials: true }
        );
        store.login(this.credentials.username);
        this.$router.push({ name: 'main' }).then(() => {
          window.location.reload();
        });
      } catch (e) {
        this.error = e.response?.data?.message || 'Login failed';
      }
    }
  }
};
</script>

<style scoped>
.login-page { max-width: 400px; margin: auto; }
</style>
