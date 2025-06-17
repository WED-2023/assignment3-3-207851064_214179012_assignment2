<template>
  <div class="preview-list">
    <RecipePreview
      v-for="r in recipes"
      :key="r.id"
      :recipe="r"
      :recipe_liked="userLikes.includes(r.id)"
      :recipe_favorited="userFavorites.includes(r.id)"
      :recipe_viewed="userHistory.includes(r.id)"
      @toggle-like="fetchUserLikes"
      @toggle-fav="fetchUserFavorites"
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
        this.userFavorites = res.data;
      } catch (e) {
        this.userFavorites = [];
      }
    },
    async fetchUserLikes() {
      try {
        const res = await axios.get(`${store.server_domain}/users/recipesliked`, { withCredentials: true });
        this.userLikes = res.data;
      } catch (e) {
        this.userLikes = [];
      }
    },
    async fetchUserHistory() {
      try {
        const res = await axios.get(`${store.server_domain}/users/history`, { withCredentials: true });
        this.userHistory = res.data;
      } catch {
        console.error('Failed to fetch view history');
      }
    },
  }
};
</script>

<style scoped></style>