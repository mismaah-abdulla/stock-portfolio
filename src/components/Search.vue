<template>
  <div>
    <v-card
      color="grey darken-2"
      dark
    >
      <v-card-text>
        <v-autocomplete
          spellcheck="false"
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          :filter="customFilter"
          color="white"
          hide-no-data
          hide-selected
          clearable
          item-text="Name"
          item-value="Code"
          placeholder="Search stock symbols and names"
          prepend-icon="search"
          return-object
          autofocus
          dense
        >
          <template v-slot:item="{ item }">
            <v-list>
            <v-list-item-title class="justify-center">{{item.Code}}</v-list-item-title>
            <v-list-item-subtitle>{{item.Name}}</v-list-item-subtitle>
            <v-list-item-subtitle>{{item.Exchange}}</v-list-item-subtitle>
            </v-list>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
    <Chart v-if="model" :key="model.Code" :stock="model"/>
  </div>
</template>

<script>
import Chart from './GChart.vue'
export default {
  name: "Search",
  components: {
    Chart,
  },
  data: () => ({
    symbolsExchangesNames: [],
    isLoading: false,
    model: null,
    search: null
  }),

  computed: {
    items () {
      return this.symbolsExchangesNames
    }
  },
  methods: {
    fetchData() {
      if (this.isLoading && this.model) return
      this.isLoading = true
      this.symbolsExchangesNames = []
      let hostname = window.location.hostname
      fetch(`http://${hostname}/backend/search/${this.search}`)
        .then(res => res.json())
        .then(res => {
          for(let i of res){
            this.symbolsExchangesNames.push({
              Code: i.Symbol,
              Exchange: i.Exchange,
              Name: i.Name,
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    fetchDebounced() {
      clearTimeout(this._timerId)
      this._timerId = setTimeout(() => {
        this.fetchData()
      }, 200)
    },
    customFilter(item, queryText){
      const textOne = item.Name.toLowerCase()
      const textTwo = item.Code.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
    }
  },
  watch: {
    search (val) {
      if(val == null || val == "") return
      if(this.model && val == this.model.Name) return
      this.fetchDebounced()
    },
  }
}
</script>