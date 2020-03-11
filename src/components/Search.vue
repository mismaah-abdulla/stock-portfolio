<template>
  <div>
    <v-card
      color="grey darken-2"
      dark
    >
      <v-card-text>
        <v-autocomplete
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          color="white"
          hide-no-data
          hide-selected
          clearable
          dense
          item-text="CodeAndName"
          item-value="Name"
          label="Stock symbols or names"
          placeholder="Start typing to Search"
          prepend-icon="mdi-account-search"
          return-object
          autofocus
        ></v-autocomplete>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
    <Chart v-if="model" :exchangeCode="model.Exchange" :symbol="model.Code"/>
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
      if (this.isLoading) return
      this.isLoading = true
      this.symbolsExchangesNames = []
      let hostname = window.location.hostname
      console.log("INSIDE fetchData() "+this.search)
      // fetch('http://192.168.1.250/API/symbols/US')
      fetch(`http://${hostname}/backend/search/${this.search}`)
        .then(res => res.json())
        .then(res => {
          for(let i of res){
            this.symbolsExchangesNames.push({
              Code: i.Symbol,
              Exchange: i.Exchange,
              Name: i.Name,
              CodeAndName: `${i.Symbol} ${i.Name}`
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
      
    }
  },
  watch: {
    search (val) {
      console.log(val)
      this.fetchDebounced()
    }
  }
}
</script>