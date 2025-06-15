<template>
  <div class="card mb-3">
    <img :src="recipe.image" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} mins | Likes: {{ recipe.popularity }}</p>
      <button class="btn btn-sm" @click="$emit('toggle-like', recipe.id)">
        {{ liked ? 'Unlike' : 'Like' }}
      </button>
      <button class="btn btn-sm ms-2" @click="$emit('toggle-fav', recipe.id)">
        {{ favorited ? 'Remove Favorite' : 'Favorite' }}
      </button>
      <router-link :to="{ name: 'RecipeView', query: { id: recipe.id } }" class="btn btn-sm btn-outline-primary ms-2">View</router-link>
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