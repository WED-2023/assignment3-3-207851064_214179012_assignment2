<template>
  <div class="recipe-view container py-4" v-if="recipe">
    <h2>{{ recipe.title }}</h2>
    <img :src="recipe.image" alt="recipe image" class="img-fluid mb-3" />
    <p>Ready in {{ recipe.readyInMinutes }} minutes | Servings: {{ recipe.servings }}</p>
    <ul>
      <li v-for="ing in recipe.ingredients" :key="ing.id">
        {{ ing.amount }} {{ ing.unit }} {{ ing.name }}
      </li>
    </ul>
    <ol>
      <li v-for="step in recipe.instructions" :key="step.number">
        {{ step.step }}
      </li>
    </ol>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';

export default {
  name: 'RecipeViewPage',
  data() {
    return { recipe: null };
  },
  async created() {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const id = this.$route.query.id;
    try {
      // Fetch details
      const res = await axios.get(
        `${store.server_domain}/recipes/information`,
        { params: { id },  withCredentials: true }
      );
      this.recipe = res.data;
    } catch (e) {
      console.error('Recipe fetch or history save failed', e);
    }
  }
};
</script>

<style scoped></style>