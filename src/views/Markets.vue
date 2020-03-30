<template>
  <div class="px-3 pt-3">
    <CompanyDetails v-if="stock" :key="stock.Code" :stock="stock"></CompanyDetails>
    <v-tabs 
      v-if="stock" 
      v-model="tab"
      background-color="transparent"
      color="basil"
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
        <ChartYD v-if="stock" :key="stock.Code" :stock="stock"/>
      </v-tab-item>
      <v-tab-item>
        <Stats v-if="stock"  :key="stock.Code" :stock="stock"></Stats>
      </v-tab-item>
      <v-tab-item>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// import Chart from '../components/Chart'
import ChartYD from '../components/ChartYD'
import CompanyDetails from '../components/CompanyDetails'
import Stats from '../components/Stats'
export default {
  name: "Search",
  components: {
    // Chart,
    ChartYD,
    CompanyDetails,
    Stats
  },
  data: () => ({
    stock: null,
    tab: null,
    tabHeaders: ["Chart", "Stats", "News Feed"]
  }),
  props: {
    code: String,
    exchange: String,
  },
  methods: {
  },
  watch: {
    model () {
      this.tab = "Stats"
    }
  },
  mounted () {
    this.stock = { Code: this.$props.code, Exchange: this.$props.exchange }
  }
}
</script>