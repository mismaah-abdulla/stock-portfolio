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
          cache-items
          clearable
          dense
          item-text="CodeAndName"
          item-value="Name"
          label="Stock symbols or names"
          placeholder="Start typing to Search"
          prepend-icon="mdi-account-search"
          return-object
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

  watch: {
    search (val) {
      console.log(val)
      if (this.items.length > 0) return
      if (this.isLoading) return
      this.isLoading = true
      fetch('http://localhost/API/symbols/US')
        .then(res => res.json())
        .then(res => {
          for(let i of res){
            this.symbolsExchangesNames.push({
              Code: i.Code,
              Exchange: i.Exchange,
              Name: i.Name,
              CodeAndName: `${i.Code} ${i.Name}`
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>