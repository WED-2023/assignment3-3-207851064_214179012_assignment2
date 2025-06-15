<template>
  <div class="search-page container py-4">
    <h2>Search Recipes</h2>
    <form @submit.prevent="search">
      <div class="row gy-2">
        <div class="col-md-4">
          <input v-model="filters.query" placeholder="Keyword" type="text" class="form-control" />
        </div>
        <div class="col-md-2">
          <input v-model="filters.cuisine" placeholder="Cuisine" class="form-control" />
        </div>
        <div class="col-md-2">
          <input v-model="filters.diet" placeholder="Diet" class="form-control" />
        </div>
        <div class="col-md-2">
          <input v-model="filters.intolerances" placeholder="Intolerances" class="form-control" />
        </div>
        <div class="col-md-2">
          <input v-model.number="filters.number" type="number" min="1" class="form-control" />
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-3">Search</button>
    </form>
    <RecipePreviewList v-if="results.length" :recipes="results" @toggle-fav="onFavToggled" />
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';
import RecipePreviewList from '@/components/RecipePreviewList.vue';

export default {
  name: 'SearchPage',
  components: { RecipePreviewList },
  data() {
    return {
      filters: { query: '', cuisine: '', diet: '', intolerances: '', number: 5 },
      results: []
    };
  },
  methods: {
    async search() {
      try {
        const res = await axios.get(
          `${store.server_domain}/recipes/search`,
          { params: this.filters }
        );
        this.results = res.data;
      } catch (e) {
        console.error('Search failed', e);
      }
    },
    onFavToggled() {
      // Optional: refresh state
    }
  }
};
</script>

<style scoped></style>