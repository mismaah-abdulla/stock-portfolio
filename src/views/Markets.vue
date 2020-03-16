<template>
  <div class="px-3 pt-3">
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
    <CompanyDetails v-if="model" :key="model.Code" :stock="model"></CompanyDetails>
    <v-tabs
      v-if="model" 
      v-model="tab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab
        v-for="item in tabHeaders"
        :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <Chart v-if="model"  :key="model.Code" :stock="model"/>
      </v-tab-item>
      <v-tab-item>
        <Stats v-if="model" :key="model.Code"></Stats>
      </v-tab-item>
      <v-tab-item>
      </v-tab-item>
    </v-tabs-items>
    
  </div>
</template>

<script>
import Chart from '../components/Chart'
import CompanyDetails from '../components/CompanyDetails'
import Stats from '../components/Stats'
export default {
  name: "Search",
  components: {
    Chart,
    CompanyDetails,
    Stats
  },
  data: () => ({
    symbolsExchangesNames: [],
    isLoading: false,
    model: null,
    search: null,
    tab: null,
    tabHeaders: ["Chart", "Stats", "News Feed"]
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