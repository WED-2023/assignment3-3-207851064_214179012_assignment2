<template>
  <div class="container py-4">
    <h2>My Family Recipes</h2>

    <!-- If not authenticated, show a link to login page -->
    <div v-if="!isAuthenticated" class="alert alert-warning">
      Please
      <router-link :to="{ name: 'login' }">Login</router-link>
      to view your family recipes.
    </div>

    <!-- If authenticated, show option to add new recipe and list of recipes -->
    <div v-else>
      <!-- <button @click="creating = !creating" class="btn btn-success mb-3">
        {{ creating ? 'Cancel' : 'Create New Family Recipe' }}
      </button>

      <form v-if="creating" @submit.prevent="submitNewRecipe">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input v-model="newRecipe.title" required class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Owner</label>
          <input v-model="newRecipe.owner" required class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Occasion</label>
          <input v-model="newRecipe.occasion" required class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Ingredients</label>
          <textarea v-model="newRecipe.ingredients" required class="form-control" rows="2"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Instructions</label>
          <textarea v-model="newRecipe.instructions" required class="form-control" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Save Recipe</button>
      </form> -->

      <div v-if="loading" class="text-center py-5">
        Loading recipes...
      </div>
      <div v-else>
        <div v-if="recipes.length === 0" class="alert alert-info">
          No family recipes yet.
        </div>
        <br>
        <div class="row">
          <div
            v-for="recipe in recipes"
            :key="recipe.recipe_id"
            class="col-md-6 mb-4"
          >
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ recipe.title }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Owner: {{ recipe.owner }}</h6>
                <p class="mb-1"><strong>Occasion:</strong> {{ recipe.occasion }}</p>
                <p class="mb-1"><strong>Ingredients:</strong> {{ recipe.ingredients }}</p>
                <p class="mb-1"><strong>Instructions:</strong></p>
                <p class="card-text pre-line">{{ recipe.instructions }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';

export default {
  name: 'FamilyRecipesPage',
  data() {
    return {
      recipes: [],
      loading: false,
      error: null,
      creating: false,
      newRecipe: {
        title: '',
        owner: '',
        occasion: '',
        ingredients: '',
        instructions: ''
      }
    };
  },
  computed: {
    // check authentication by existence of username in localStorage
    isAuthenticated() {
      return !!localStorage.getItem('username');
    }
  },
  async created() {
    if (this.isAuthenticated) {
      await this.loadRecipes();
    }
  },
  methods: {
    async loadRecipes() {
      this.loading = true;
      try {
        const res = await axios.get(
          `${store.server_domain}/users/familyRecipes`,
          { withCredentials: true }
        );
        this.recipes = Array.isArray(res.data) ? res.data : [];
      } catch (e) {
        console.error('Error loading family recipes:', e);
        this.error = 'Error loading family recipes.';
      } finally {
        this.loading = false;
      }
    },
    async submitNewRecipe() {
      this.error = null;
      try {
        await axios.post(
          `${store.server_domain}/users/familyRecipes`,
          this.newRecipe,
          { withCredentials: true }
        );
        // Reset form and reload recipes
        this.creating = false;
        this.newRecipe = {
          title: '',
          owner: '',
          occasion: '',
          ingredients: '',
          instructions: ''
        };
        await this.loadRecipes();
      } catch (e) {
        console.error('Error saving new recipe:', e);
        this.error = 'Error saving new recipe.';
      }
    }
  }
};
</script>

<style scoped>
.pre-line {
  white-space: pre-line;
}
</style>
