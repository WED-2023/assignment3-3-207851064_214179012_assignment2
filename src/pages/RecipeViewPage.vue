<template>
  <div class="recipe-view container py-4" v-if="recipe">
    <h2>{{ recipe.title }}</h2>
    <img :src="recipe.image" alt="recipe image" class="img-fluid mb-3" />

    <!-- Dietary badges -->
    <div class="mb-2">
      <span
        v-if="recipe.vegan"
        class="badge bg-success me-1">Vegan</span>
      <span
        v-if="recipe.vegetarian"
        class="badge bg-info text-white me-1">Vegetarian</span>
      <span
        v-if="recipe.glutenFree"
        class="badge bg-warning text-dark">Gluten Free</span>
    </div>
    
    <p>Ready in {{ recipe.readyInMinutes }} minutes | Servings: {{ recipe.servings }}</p>
    
    <h5>Ingredients:</h5>
    <ul>
      <li v-for="ing in recipe.ingredients" :key="ing.id">
        {{ ing.amount }} {{ ing.unit }} {{ ing.name }}
      </li>
    </ul>

    <h5>Instructions:</h5>
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
    const source = this.$route.query.source;
    try {
      let res;
      if (source === 'db') {
        // Fetch from your own DB
        res = await axios.get(
          `${store.server_domain}/users/myRecipes`,
          { withCredentials: true }
        );
        const recipe = res.data.find(recipe => recipe.id === parseInt(id));
        this.recipe = recipe || null;
      } else {
        // Fetch from external API
        res = await axios.get(
          `${store.server_domain}/recipes/information`,
          { params: { id }, withCredentials: true }
        );
        this.recipe = res.data;
      }
    } catch (e) {
      console.error('Recipe fetch or history save failed', e);
    }
  }
};
</script>

<style scoped></style>