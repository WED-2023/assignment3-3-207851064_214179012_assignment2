<template>
  <div class="main-page container py-4">
    <div class="row">
      <div class="col-md-4">
        <h3>Random Recipes</h3>
        <RecipePreviewList 
        :recipes="randomRecipes"
        class="horizontal-list"/>
        <button class="btn btn-outline-primary mt-3" @click="refresh">Refresh</button>
      </div>
      <div class="col-md-4">
        <div v-if="isAuthenticated">
          <h3>Last Watched Recipes</h3>
          <RecipePreviewList 
          v-if="historyRecipes.length"
          :recipes="historyRecipes"/>
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
    return {
      randomRecipes: [],
      historyRecipes: []
    };
  },
  computed: {
    username() { return store.username; },
    isAuthenticated() { return !!localStorage.getItem('username'); }
  },
  async mounted() {
    // initial fetch only on first render
    await this.fetchRandom();
    if (this.isAuthenticated) {
      await this.fetchHistory();
    }
  },
  methods: {
    async fetchRandom() {
      try {
        const res = await axios.get(
          `${store.server_domain}/recipes/random`,
          { params: { number: 3 } }
        );
        this.randomRecipes = res.data;
      } catch (e) {
        console.error('Failed to fetch random recipes', e);
      }
    },
    refresh() { return this.fetchRandom(); },
    async fetchHistory() {
      try {
        const resIds = await axios.get(
          `${store.server_domain}/users/history`,
          { withCredentials: true }
        );
        const ids = resIds.data.slice(0,3).join(','); // limit to 3 most recent
        if (ids) {
          const res = await axios.get(
            `${store.server_domain}/recipes/home`,
            { params: { ids }, withCredentials: true }
          );
          this.historyRecipes = res.data;
        }
      } catch (e) {
        console.error('Failed to fetch last viewed recipes', e);
      }
    },
  }
};
</script>

<style scoped>
.horizontal-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}
.horizontal-list > * {
  flex: 0 0 220px; /* Adjust width as needed */
  max-width: 220px;
}
</style>
