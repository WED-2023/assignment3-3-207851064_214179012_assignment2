<template>
  <div class="main-page container py-4">
    <div class="row">
      <div class="col-md-8">
        <h3>Random Recipes</h3>
        <RecipePreviewList :recipes="randomRecipes" @toggle-fav="fetchHistory" />
        <button class="btn btn-outline-primary mt-3" @click="refresh">Refresh</button>
      </div>
      <div class="col-md-4">
        <div v-if="isAuthenticated">
          <p class="fw-bold">Hello {{ username }}</p>
          <button class="btn btn-secondary mb-3" @click="logout">Logout</button>
          <h5>Last Watched Recipes</h5>
          <RecipePreviewList :recipes="historyRecipes" @toggle-fav="fetchHistory" />
        </div>
        <div v-else>
          <p>Please <router-link to="/login">login</router-link> to see your history.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';
import RecipePreviewList from '@/components/RecipePreviewList.vue';

export default {
  name: 'MainPage',
  components: { RecipePreviewList },
  data() {
    return { randomRecipes: [], historyRecipes: [] };
  },
  computed: {
    username() { return store.username; },
    isAuthenticated() { return !!localStorage.getItem('username'); }
  },
  async created() {
    await this.refresh();
    if (this.isAuthenticated) await this.fetchHistory();
  },
  methods: {
    async fetchRandom() {
      const res = await axios.get(`${store.server_domain}/recipes/random`, { params: { number: 3 } });
      this.randomRecipes = res.data;
    },
    refresh() { return this.fetchRandom(); },
    async fetchHistory() {
      const resIds = await axios.get(`${store.server_domain}/users/history`, { withCredentials: true });
      const ids = resIds.data.join(',');
      if (ids) {
        const res = await axios.get(`${store.server_domain}/recipes/home`, { params: { ids }, withCredentials: true });
        this.historyRecipes = res.data;
      }
    },
    logout() {
      store.logout();
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped></style>
