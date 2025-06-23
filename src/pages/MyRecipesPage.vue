<template>
  <div class="my-recipes-page container py-4">
    <!-- header + create button -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>My Recipes</h3>
      <b-button variant="primary" @click="showModal = true">
        Create New Recipe
      </b-button>
    </div>

    <div v-if="recipes.length === 0" class="alert alert-info">
      You haven’t created any recipes yet.
    </div>

    <!-- grid of preview cards using BootstrapVue b-card -->
    <div v-else class="my-recipes-list">
      <div class="horizontal-list">
        <b-card
          v-for="r in recipes"
          :key="r.id"
          :title="r.title"
          style="max-width: 20rem;"
          class="mb-2 h-100 preview-card"
        >
          <template #header>
            <router-link
              :to="{ name: 'RecipeView', query: { id: r.id, source: 'db' } }"
              class="d-block position-relative"
              style="border-radius: 0.5rem 0.5rem 0 0; overflow: hidden;"
            >
              <img
                :src="r.image || 'https://via.placeholder.com/400x200?text=Recipe+Image'"
                alt="recipe image"
                class="w-100 clickable-img"
                style="height: 200px; object-fit: cover;"
              />
              <div class="click-hint">Click to view recipe</div>
            </router-link>
          </template>
          <template #default>
            <div class="mb-2">
              <span v-if="r.vegan" class="badge bg-success me-1">Vegan</span>
              <span v-if="r.vegetarian" class="badge bg-info text-white me-1">Vegetarian</span>
              <span v-if="r.glutenFree" class="badge bg-warning text-dark">Gluten Free</span>
            </div>
            <p class="card-text mb-2">
              {{ r.readyInMinutes }} mins
            </p>
            <router-link
              :to="{ name: 'RecipeView', query: { id: r.id, source: 'db' } }"
              class="btn btn-sm btn-primary w-100">
              View my recipe
            </router-link>
          </template>
        </b-card>
      </div>
    </div>

    <!-- BootstrapVue 3 Modal for creating a new recipe -->
    <b-modal v-model="showModal" title="Create New Recipe" @hide="resetForm" hide-footer>
      <form @submit.prevent="handleCreateRecipe">
        <div class="card preview-card position-relative mb-0">
          <div class="position-relative">
            <img
              :src="form.image || 'https://via.placeholder.com/400x200?text=Recipe+Image'"
              class="card-img-top"
              alt="recipe image"
              style="object-fit: cover; height: 200px;"
            />
          </div>
          <div class="card-body">
            <h5 class="card-title mb-2">
              <input
                v-model="form.title"
                class="form-control"
                placeholder="Title"
                required
              />
            </h5>
            <p class="card-text mb-2">
              Ready in:
              <input
                v-model.number="form.readyInMinutes"
                type="number"
                class="form-control d-inline-block w-auto"
                placeholder="Ready in Minutes"
                min="0"
                required
                style="width: 120px;"
              />
              <span class="ms-2">mins</span>
            </p>
            <p class="card-text mb-2">
              <input
                v-model="form.image"
                class="form-control"
                placeholder="Image URL"
                required
              />
            </p>
            <!-- Servings -->
            <p class="card-text mb-2">
              <input
                v-model.number="form.servings"
                type="number"
                class="form-control d-inline-block w-auto"
                placeholder="Servings"
                min="1"
                required
                style="width: 120px;"
              />
              <span class="ms-2">servings</span>
            </p>
            <!-- Ingredients -->
            <div class="mb-2">
              <label class="form-label fw-bold">Ingredients:</label>
              <div v-for="(ing, idx) in form.ingredients" :key="idx" class="input-group mb-1">
                <input v-model="ing.amount" type="number" min="0" class="form-control" placeholder="Amount" style="max-width: 80px;">
                <input v-model="ing.unit" class="form-control" placeholder="Unit" style="max-width: 80px;">
                <input v-model="ing.name" class="form-control" placeholder="Ingredient name">
                <button type="button" class="btn btn-outline-danger" @click="removeIngredient(idx)">×</button>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary" @click="addIngredient">Add Ingredient</button>
            </div>
            <!-- Instructions -->
            <div class="mb-2">
              <label class="form-label fw-bold">Instructions:</label>
              <div v-for="(step, idx) in form.instructions" :key="idx" class="input-group mb-1">
                <span class="input-group-text">{{ idx + 1 }}</span>
                <input v-model="step.step" class="form-control" placeholder="Instruction step">
                <button type="button" class="btn btn-outline-danger" @click="removeInstruction(idx)">×</button>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary" @click="addInstruction">Add Step</button>
            </div>
            <!-- Dietary badges -->
            <div class="mb-2">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form.vegan" id="vegan">
                <label class="form-check-label badge bg-success" for="vegan">Vegan</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form.vegetarian" id="vegetarian">
                <label class="form-check-label badge bg-info text-white" for="vegetarian">Vegetarian</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form.glutenFree" id="glutenFree">
                <label class="form-check-label badge bg-warning text-dark" for="glutenFree">Gluten Free</label>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex justify-content-end gap-2">
          <b-button variant="secondary" @click="showModal = false">Cancel</b-button>
          <b-button type="submit" variant="primary">Save</b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';

export default {
  name: 'MyRecipesPage',
  data() {
    return {
      showModal: false,
      recipes: [],
      form: {
        title: '',
        image: '',
        readyInMinutes: 0,
        servings: 1,
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        ingredients: [],
        instructions: [],
      }
    };
  },
  async created() {
    await this.fetchMyRecipes();
  },
  methods: {
    resetForm() {
      this.form = {
        title: '',
        image: '',
        readyInMinutes: 0,
        servings: 1,
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        ingredients: [],
        instructions: [],
      };
    },
    addIngredient() {
      this.form.ingredients.push({ amount: '', unit: '', name: '' });
    },
    removeIngredient(idx) {
      this.form.ingredients.splice(idx, 1);
    },
    addInstruction() {
      this.form.instructions.push({ step: '' });
    },
    removeInstruction(idx) {
      this.form.instructions.splice(idx, 1);
    },
    async fetchMyRecipes() {
      try {
        const res = await axios.get(
          `${store.server_domain}/users/myRecipes`,
          { withCredentials: true }
        );
        this.recipes = res.data;
      } catch (e) {
        console.error('Failed to load your recipes', e);
      }
    },
    async handleCreateRecipe() {
      const newRecipe = {
        ...this.form,
        id: Date.now(),
      };
      try {
        await axios.post(
          `${store.server_domain}/users/myRecipes`,
          newRecipe,
          { withCredentials: true }
        );
        await this.fetchMyRecipes();
        this.showModal = false;
        this.resetForm();
      } catch (e) {
        console.error('Failed to save new recipe', e);
      }
    },
  },
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
.my-recipes-page .card {
  cursor: default;
}
.preview-card {
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
  border-radius: 0.5rem;
  overflow: hidden;
}
.clickable-img {
  cursor: pointer;
  transition: opacity 0.2s;
}
.click-hint {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  font-size: 0.9rem;
  text-transform: uppercase;
}
.b-card:hover .clickable-img {
  opacity: 0.8;
}
.b-card:hover .click-hint {
  display: flex;
}
</style>