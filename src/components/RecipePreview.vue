<template>
  <div class="card mb-4 preview-card position-relative">
    <!-- Clickable image wrapper -->
    <router-link
      :to="{ name: 'RecipeView', query: { id: recipe.id } }"
      class="d-block position-relative"
    >
      <img
        :src="recipe.image"
        class="card-img-top clickable-img"
        alt="recipe image"
      />
      <div class="click-hint">
        Click to view recipe
      </div>
    </router-link>

    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">
        {{ recipe.readyInMinutes }} mins |
        Likes: {{ recipe.popularity }}
      </p>

      <!-- Dietary badges -->
      <div class="mb-2">
        <span
          v-if="recipe.vegan"
          class="badge bg-success me-1"
        >Vegan</span>
        <span
          v-if="recipe.vegetarian"
          class="badge bg-info text-white me-1"
        >Vegetarian</span>
        <span
          v-if="recipe.glutenFree"
          class="badge bg-warning text-dark"
        >Gluten Free</span>
      </div>

      <!-- Viewed indicator -->
      <div class="mb-3">
        <span
          v-if="viewed"
          class="text-muted"
        >Already Viewed</span>
        <span
          v-else
          class="text-muted"
        >Not Viewed</span>
      </div>

      <!-- Action buttons -->
      <div>
        <button
          type="button"
          @click="$emit('toggle-like', recipe.id)"
          class="btn btn-sm"
          :class="liked ? 'btn-danger' : 'btn-outline-danger'"
        >
          {{ liked ? 'Unlike' : 'Like' }}
        </button>

        <button
          v-if="!favorited"
          type="button"
          @click="$emit('toggle-fav', recipe.id)"
          class="btn btn-sm ms-2 btn-outline-warning"
        >
          Add to Favorites
        </button>
        <span
          v-else
          class="btn btn-sm ms-2 btn-warning disabled"
        >
          Saved to Favorites
        </span>

        <router-link
          :to="{ name: 'RecipeView', query: { id: recipe.id } }"
          class="btn btn-sm btn-primary ms-2"
        >
          View
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipePreview',
  props: {
    recipe: { type: Object, required: true },
    liked: { type: Boolean, default: false },
    favorited: { type: Boolean, default: false },
    viewed: { type: Boolean, default: false }
  }
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
