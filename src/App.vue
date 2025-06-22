<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <ul class="nav nav-tabs w-100">
          <!-- Main links -->
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'main' }" exact-active-class="active">Main</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'search' }" exact-active-class="active">Search</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'about' }" exact-active-class="active">About</router-link>
          </li>

          <!-- Spacer -->
          <li class="nav-item ms-auto">
            <span v-if="!isAuthenticated" class="nav-link disabled">Hello Guest</span>
            <span v-else class="nav-link disabled">Hello {{ username }}</span>
          </li>

          <!-- Auth links or Personal dropdown -->
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" :to="{ name: 'login' }">Login</router-link>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" :to="{ name: 'register' }">Register</router-link>
          </li>

          <li v-else class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Personal
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'favorites' }">My Favorites</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'myRecipes' }">My Recipes</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'familyRecipes' }">Family Recipes</router-link>
              </li>
              <li><hr class="dropdown-divider"/></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">Sign Out</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
// import store from '@/store';

export default {
  name: 'App',
  computed: {
    username() { return this.store.username; },
    isAuthenticated() { return !!this.store.username; }
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;

    const logout = () => {
      store.logout();
      toast("Logout", "User logged out successfully", "success");
      router.push({ name: 'main' }).then(() => {
          window.location.reload();
        });
    };
    return { store, router, logout };
  }
};
</script>

<style scoped>
.nav-tabs .nav-link.active {
  background-color: #e9ecef;
}
.nav-tabs .nav-item.ms-auto {
  margin-left: auto;
  margin-right: 1rem;
}
</style>

