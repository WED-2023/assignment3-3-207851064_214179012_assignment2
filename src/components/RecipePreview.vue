<template>
  <div class="card mb-4 preview-card position-relative">
    <!-- Clickable image wrapper -->
    <router-link
      :to="{ name: 'RecipeView', query: { id: id } }"
      class="d-block position-relative">
      <img
        :src="image"
        class="card-img-top clickable-img"
        alt="recipe image"/>
      <div class="click-hint">
        Click to view recipe
      </div>
    </router-link>

    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">
        {{ readyInMinutes }} mins |
        Likes: {{ aggregateLikes }}
      </p>

      <!-- Dietary badges -->
      <div class="mb-2">
        <span
          v-if="vegan"
          class="badge bg-success me-1">Vegan</span>
        <span
          v-if="vegetarian"
          class="badge bg-info text-white me-1">Vegetarian</span>
        <span
          v-if="glutenFree"
          class="badge bg-warning text-dark">Gluten Free</span>
      </div>

      <!-- Viewed indicator -->
      <div class="mb-3">
        <span
          v-if="viewed"
          class="text-muted">Already Viewed</span>
        <span
          v-else
          class="text-muted">Not Viewed</span>
      </div>

      <!-- Action buttons -->
      <div>
        <button
          type="button"
          @click="toggleLike"
          class="btn btn-sm"
          :class="liked ? 'btn-danger' : 'btn-outline-danger'">
          {{ liked ? 'Unlike' : 'Like' }}
        </button>
        <button
          v-if="!favorited"
          type="button"
          @click="toggleFavorite"
          class="btn btn-sm ms-2 btn-outline-warning">
          Add to Favorites
        </button>
        <span
          v-else
          class="btn btn-sm ms-2 btn-warning disabled">
          Saved to Favorites
        </span>

        <router-link
          :to="{ name: 'RecipeView', query: { id: recipe.id } }"
          class="btn btn-sm btn-primary ms-2">
          View
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';
export default {
  name: 'RecipePreview',
  props: {
    recipe_liked: { type: Boolean, default: false },
    recipe_favorited: { type: Boolean, default: false },
    recipe_viewed: { type: Boolean, default: false },
    recipe: { type: Object,required: true },
  },
  data() {
    return {
      liked:      this.recipe_liked,
      favorited:  this.recipe_favorited,
      viewed:     this.recipe_viewed,

      id: 0,
      title: "",
      image: "",
      readyInMinutes: 0,
      aggregateLikes: 0,
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      
    };
  },
  created() {
    this.initFromProps()
  },
  watch: {
    // keep local state in sync if parent ever changes these props
    recipe_liked(val)     { this.liked     = val },
    recipe_favorited(val) { this.favorited = val },
    recipe_viewed(val)    { this.viewed    = val },
    // also watch the recipe object if you need…
    recipe: {
      handler() { this.initFromProps() },
      deep: true
    }
  },
  methods: {
    initFromProps() {
      // copy recipe into your data fields
      this.id              = this.recipe.id
      this.title           = this.recipe.title
      this.image           = this.recipe.image
      this.readyInMinutes  = this.recipe.readyInMinutes
      this.aggregateLikes  = this.recipe.popularity
      this.vegan           = this.recipe.vegan
      this.vegetarian      = this.recipe.vegetarian
      this.glutenFree      = this.recipe.glutenFree
      // copy the three booleans
      this.liked           = this.recipe_liked
      this.favorited       = this.recipe_favorited
      this.viewed          = this.recipe_viewed
    },
    async toggleLike() {
      try {
        await axios.post(
          `${store.server_domain}/users/likespooncular`, null,
          { params: { id: this.id }, withCredentials: true });

        if (this.liked) {
          this.liked = false;
          this.aggregateLikes -= 1; }
        else {
          this.liked = true;
          this.aggregateLikes += 1; }
        this.$emit('toggle-like');
      } catch (e) {
        console.error('toggleLike error', e);
      }
    },
    async toggleFavorite() {
      try {
        await axios.post(`${store.server_domain}/users/favorites`, { recipeId: this.id }, { withCredentials: true });
        this.favorited = !this.favorited;
        this.$emit('toggle-fav');
      } catch(e) {
        console.log(e);
      }
    }
  },
};
</script>

<style scoped>
.preview-card {
  overflow: hidden;
}

/* Make it clear the image is clickable */
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

/* On hover, dim the image and show the hint overlay */
.preview-card:hover .clickable-img {
  opacity: 0.8;
}
.preview-card:hover .click-hint {
  display: flex;
}
</style>
