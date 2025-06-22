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
      <div class="row mt-2 align-items-end">
        <div class="col-md-3">
          <select v-model="sortBy" class="form-select">
            <option value="">No sorting</option>
            <option value="readyInMinutes">Sort by Ready in Minutes</option>
            <option value="popularity">Sort by Popularity</option>
          </select>
        </div>
        <div class="col-md-2">
          <button type="button" class="btn btn-secondary" @click="sortResults">Sort</button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-3">Search</button>
    </form>
    <RecipePreviewList
      v-if="sortedResults.length"
      :recipes="sortedResults"
      class="horizontal-list"
      @toggle-fav="onFavToggled"
    />
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
      results: [],
      sortedResults: [],
      sortBy: ''
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
        this.sortResults(); // sort after search
      } catch (e) {
        console.error('Search failed', e);
      }
    },
    sortResults() {
      if (!this.sortBy) {
        this.sortedResults = [...this.results];
      } else if (this.sortBy === 'readyInMinutes') {
        this.sortedResults = [...this.results].sort((a, b) => a.readyInMinutes - b.readyInMinutes);
      } else if (this.sortBy === 'popularity') {
        this.sortedResults = [...this.results].sort(
          (a, b) => Number(b.popularity || 0) - Number(a.popularity || 0)
        );
      } else {
        this.sortedResults = [...this.results];
      }
    },
    onFavToggled() {
      // Optional: refresh state
    }
  },
  watch: {
    sortBy() {
      this.sortResults();
    }
  }
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
</style>