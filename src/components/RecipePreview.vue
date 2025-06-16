<template>
  <div class="card mb-4">
    <img :src="recipe.image" class="card-img-top" alt="recipe image">
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} mins | Likes: {{ recipe.popularity + (liked ? 1 : 0) }}</p>
      <div>
        <button
          @click="$emit('toggle-like', recipe.id)"
          class="btn btn-sm"
          :class="liked ? 'btn-danger' : 'btn-outline-danger'"
        >
          {{ liked ? 'Unlike' : 'Like' }}
        </button>
        <button
          @click="$emit('toggle-fav', recipe.id)"
          class="btn btn-sm ms-2"
          :class="favorited ? 'btn-warning' : 'btn-outline-warning'"
        >
          {{ favorited ? 'Unfavorite' : 'Favorite' }}
        </button>
        <router-link :to="{ name: 'RecipeView', query: { id: recipe.id } }" class="btn btn-sm btn-primary ms-2">
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
    favorited: { type: Boolean, default: false }
  }
};
</script>

<style scoped></style>
