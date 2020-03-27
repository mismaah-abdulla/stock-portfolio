<template>
  <div>
    <v-row v-if="!loaded" class="pt-5 mt-5" justify="center">
      <v-progress-circular
        :size="50"
        :width="5"
        color="grey"
        indeterminate>
      </v-progress-circular>
    </v-row>
    <GChart v-if="loaded"
        type="LineChart"
        :data="stockData"
        :options="options"
      />
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
export default {
  name: "ChartYD",
  components: {
    GChart,
  },
  props: {
    stock: Object,
  },
  data: () => ({
    loaded: false,
    stockData: null,
    options: null,
  }),
  methods: {
    getData () {
      this.loaded = false
      let hostname = window.location.hostname
      let ydAPI = `http://${hostname}/backend/yd/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
      try{
        fetch(ydAPI)
        .then(response => response.json())
        .then(data => {
          this.stockData = data
          this.loaded = true
        })
      }
      catch(e){
        console.log(e)
      }
    },
    renderChart (data){
      
    }
  },
  mounted(){
    this.getData()
  }
}
</script>