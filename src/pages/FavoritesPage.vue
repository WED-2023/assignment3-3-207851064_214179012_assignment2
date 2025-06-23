<template>
  <div class="container py-4">
    <h2>My Favorits</h2>
    <div v-if="favorites.length === 0" class="alert alert-info">
          No favorite recipes yet.
    </div>
    <div v-else>
      <RecipePreviewList 
      :recipes="favorites"
      class="horizontal-list"/>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import store from '@/store';
import RecipePreviewList from '@/components/RecipePreviewList.vue';
export default {
  name: 'FavoritesPage',
  components: { RecipePreviewList },
  data() { return { favorites: [] }; },
  async created() {
    try {
        const res = await axios.get(`${store.server_domain}/users/favorites`, { withCredentials: true });
        const ids = res.data.join(',');
        if (ids) {
        const info = await axios.get(`${store.server_domain}/recipes/home`, { params: { ids }, withCredentials: true });
        this.favorites = info.data;
        }
    } catch (e) {
      console.error('Failed to fetch favorites', e);
      this.favorites = [];
    }
    
  }
};
</script>

<style scoped>
.horizontal-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}
.horizontal-list > * {
  flex: 0 0 220px; /* Adjust width as needed */
  max-width: 220px;
}
</style>