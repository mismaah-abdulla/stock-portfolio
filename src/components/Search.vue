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
      <!-- <v-expand-transition>
        <v-list v-if="model" class="red lighten-3">
          <v-list-tile
            v-for="(field, i) in fields"
            :key="i"
          >
            <v-list-tile-content>
              <v-list-tile-title v-text="field.value"></v-list-tile-title>
              <v-list-tile-sub-title v-text="field.key"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-expand-transition> -->
      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!model"
          color="grey darken-3"
          @click="model = null"
        >
          Clear
          <v-icon right>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-actions> -->
      
    </v-card>
    <Chart v-if="model!=null" :exchangeCode="model.Exchange" :symbol="model.Code"/>
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
    symbols: [],
    symbolsExchangesNames: [],
    symbolsAndNames: [],
    isLoading: false,
    model: null,
    search: null
  }),

  computed: {
    // fields () {
    //   if (!this.model) return []

    //   return Object.keys(this.model).map(key => {
    //     return {
    //       key,
    //       value: this.model[key] || 'n/a'
    //     }
    //   })
    // },
    items () {
      return this.symbolsExchangesNames
    }
  },

  watch: {
    search (val) {
      console.log(val)
      // Items have already been loaded
      if (this.items.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      fetch('http://localhost/API/symbols/SG')
        .then(res => res.json())
        .then(res => {
          for(let i of res){
            this.symbols.push(i)
            this.symbolsExchangesNames.push({
              Code: i.Code,
              Exchange: i.Exchange,
              Name: i.Name,
              CodeAndName: `${i.Code} ${i.Name}`
            })
            this.symbolsAndNames.push(`${i.Code} ${i.Name}`)
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