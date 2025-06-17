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
            maxlength="8"
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
            minlength="5"
            maxlength="10"
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Confirm Password</label>
          <input
            v-model="this.Cpassword"
            type="password"
            class="form-control"
            required
            minlength="5"
            maxlength="10"
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
      Cpassword: '', // for confirm password
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
    // returns null if ok, or an error message
    validate() {
    // username: 3–8 letters only
    if (!/^[A-Za-z]{3,8}$/.test(this.form.username)) {
      return 'Username must be 3–8 letters only.';
    }
    // password: 5–10 chars, at least one digit and one special
    if (!/^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{5,10}$/.test(this.form.password)) {
      return 'Password must be 5–10 chars, include at least one number and one special character.';
    }
    // confirm password matches
    if (this.form.password !== this.Cpassword) {
      return 'Passwords do not match.';
    }
    return null;
  },
    async register() {
      this.error = null;
      try {
        // Validate form data
        const validationError = this.validate();
        if (validationError) {
          this.error = validationError;
          return;
        }
        await axios.post(
          `${store.server_domain}/auth/Register`,
          this.form
        );
        this.$router.push('/login');
        // this.$router.push({ name: 'LoginPage' });
      } catch (e) {
        this.error = e.response?.data?.message;
      }
    }
  }
};
</script>

<style scoped></style>
