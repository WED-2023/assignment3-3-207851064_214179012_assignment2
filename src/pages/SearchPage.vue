<template>
  <div class="search-page container-fluid py-4">
    <h2>Search Recipes</h2>
    <form @submit.prevent="search">
      <div class="row gy-2">

        <div class="col-md-4">
          Enter query:
          <input v-model="filters.query" placeholder="Keyword" type="text" class="form-control" />
        </div>

        <div class="col-md-2">
          Cuisine:
          <select v-model="filters.cuisine" class="form-select">
            <option value="">None</option>
            <option v-for="option in cuisineOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <div class="col-md-2">
          Diet:
          <select v-model="filters.diet" class="form-select">
            <option value="">None</option>
            <option v-for="option in dietOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="col-md-2">
          Intolerances:
          <select v-model="filters.intolerances" class="form-select">
            <option value="">None</option>
            <option v-for="option in intoleranceOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <div class="col-md-2">
          Number of results:
          <input v-model.number="filters.number" type="number" min="1" class="form-control" />
        </div>

      </div>
      <div class="row mt-2 align-items-end">
        <div class="col-md-3">
          <select v-model="sortBy" class="form-select">
            <option value="">No sorting</option>
            <option value="time">Sort by Ready in Minutes</option>
            <option value="popularity">Sort by Popularity</option>
          </select>
        </div>
        <!-- <div class="col-md-2">
          <button type="button" class="btn btn-secondary" @click="sortResults">Sort</button>
        </div> -->
      </div>
      <button type="submit" class="btn btn-primary mt-3">Search</button>
    </form>
    <br>
    <div v-if="sortedResults.length === 0 && requestSent" class="alert alert-info">
      No recipes found. Please try different filters.
    </div>
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
      requestSent: false,
      filters: { query: '', cuisine: '', diet: '', intolerances: '', number: 5 },
      results: [],
      sortedResults: [],
      sortBy: '',
      cuisineOptions: [
        'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese',
        'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish',
        'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean',
        'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
      ],
      dietOptions: [
        { value: 'Gluten Free', label: 'Gluten Free' },
        { value: 'Ketogenic', label: 'Ketogenic' },
        { value: 'Vegetarian', label: 'Vegetarian' },
        { value: 'Lacto-Vegetarian', label: 'Lacto-Vegetarian' },
        { value: 'Ovo-Vegetarian', label: 'Ovo-Vegetarian' },
        { value: 'Vegan', label: 'Vegan' },
        { value: 'Pescetarian', label: 'Pescetarian' },
        { value: 'Paleo', label: 'Paleo' },
        { value: 'Primal', label: 'Primal' },
        { value: 'Low FODMAP', label: 'Low FODMAP' },
        { value: 'Whole30', label: 'Whole30' }
      ],
      intoleranceOptions: [
        'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame',
        'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
      ]
    };
  },
  methods: {
    async search() {
      try {
        this.requestSent = true;
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
      } else if (this.sortBy === 'time') {
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
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  justify-content: flex-start;
}
.horizontal-list > * {
  flex: 1 1 300px; /* Cards will grow to fill space, min 300px */
  max-width: 350px;
  min-width: 250px;
}
</style>