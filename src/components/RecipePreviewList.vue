<template>
  <div class="preview-list">
    <RecipePreview
      v-for="r in recipes"
      :key="r.id"
      :recipe="r"
      :liked="Array.isArray(userLikes) && userLikes.includes(r.id)"
      :favorited="Array.isArray(userFavorites) && userFavorites.includes(r.id)"
      :viewed="userHistory.includes(r.id)"
      @toggle-like="toggleLike"
      @toggle-fav="toggleFav"
    />
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';
import RecipePreview from './RecipePreview.vue';
export default {
  name: 'RecipePreviewList',
  components: { RecipePreview },
  props: {
    recipes: { type: Array, required: true }
  },
  data() {
    return {
      userFavorites: [],
      userLikes: [],
      userHistory: [],
    };
  },
  async created() {
    await this.fetchUserFavorites();
    await this.fetchUserLikes();
    await this.fetchUserHistory();
  },
  methods: {
    async fetchUserFavorites() {
      try {
        const res = await axios.get(`${store.server_domain}/users/favorites`, { withCredentials: true });
        this.userFavorites = Array.isArray(res.data) ? res.data : [];
      } catch (e) {
        this.userFavorites = [];
      }
    },
    async fetchUserLikes() {
      try {
        const res = await axios.get(`${store.server_domain}/users/recipesliked`, { withCredentials: true });
        // backend returns raw array
        this.userLikes = Array.isArray(res.data) ? res.data : res.data.liked || [];
      } catch (e) {
        this.userLikes = [];
      }
    },
    async fetchUserHistory() {
      try {
        const res = await axios.get(
          `${store.server_domain}/users/history`,
          { withCredentials: true }
        );
        this.userHistory = Array.isArray(res.data) ? res.data : [];
      } catch {
        console.error('Failed to fetch view history');
      }
    },
    async toggleFav(id) {
      try {
        await axios.post(`${store.server_domain}/users/favorites`, { recipeId: id }, { withCredentials: true });
        await this.fetchUserFavorites();
        this.$emit('toggle-fav');
      } catch(e) {
        console.log(e);
      }
    },
    async toggleLike(id) {
      try {
        await axios.post(
          `${store.server_domain}/users/likespooncular`,
          null,
          { params: { id }, withCredentials: true }
        );
        await this.fetchUserLikes();
        this.$emit('toggle-like');
        window.location.reload();
      } catch (e) {
        console.error('toggleLike error', e);
      }
    }
  }
};
</script>

<style scoped></style>