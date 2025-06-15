<template>
  <div class="preview-list">
    <RecipePreview
      v-for="r in recipes"
      :key="r.id"
      :recipe="r"
      :liked="userLikes.includes(r.id)"
      :favorited="userFavorites.includes(r.id)"
      @toggle-like="toggleLike"
      @toggle-fav="toggleFav"
    />
  </div>
</template>

<script>
import axios from 'axios';
import RecipePreview from './RecipePreview.vue';
export default {
  name: 'RecipePreviewList',
  components: { RecipePreview },
  props: { recipes: { type: Array, required: true } },
  data() {
    return {
      userFavorites: [],
      userLikes: []
    };
  },
  async created() {
    await this.fetchUserFavorites();
    // userLikes could come from a separate endpoint or tracked locally
  },
  methods: {
    async fetchUserFavorites() {
      try {
        const res = await axios.get('/users/favorites');
        this.userFavorites = res.data;
      } catch {
        console.error('Failed to fetch user favorites');
      }
    },
    async toggleFav(id) {
      try {
        if (this.userFavorites.includes(id)) {
          await axios.delete(`/users/favorites/${id}`);
        } else {
          await axios.post('/users/favorites', { recipeId: id });
        }
        await this.fetchUserFavorites();
        this.$emit('toggle-fav');
      } catch (e) {
        console.error(e);
      }
    },
    async toggleLike(id) {
      try {
        await axios.post('/users/likespooncular', null, { params: { id } });
        // Optionally update local like state
        this.userLikes = this.userLikes.includes(id)
          ? this.userLikes.filter(x => x !== id)
          : [...this.userLikes, id];
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style scoped></style>
