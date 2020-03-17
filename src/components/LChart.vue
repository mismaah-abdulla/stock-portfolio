<template>
  <div>
    <v-row v-if="!loaded" class="pt-5 mt-5" justify="center">
        <v-progress-circular
          :size="50"
          :width="5"
          color="grey"
          indeterminate
        ></v-progress-circular>
      </v-row>
    <GChart v-else
    type="LineChart"
    :data="stockData"
    :options="options"
  />
  </div>
</template>
<script>
import { GChart } from 'vue-google-charts'
export default {
  name: "LChart",
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
    fetchedData: null,
    duration: 120
  }),
  methods: {
    renderChart (data, duration) {
      this.stockData = [['Date', '']]
      if (duration > data.length) duration = data.length
      for(let i = data.length-duration; i < data.length; i++){
        let moment = require('moment')
        let date = new Date(data[i].date)
        if(date.getFullYear() >= new Date().getFullYear()-1){
          let daymonth = moment(new Date(date)).format("DD MMM")
          this.stockData.push([daymonth, data[i].low])
        }  
      }
      this.options = {
        legend: 'none',
        chartArea: {
          top: 20,
          left: 40,
          right: 20,
          bottom: 45
        },
        height: 450,
      }
    },
    getData () {
      this.loaded = false
      let hostname = window.location.hostname
      let eodlAPI = `http://${hostname}/backend/eodl/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
      try{
        fetch(eodlAPI)
        .then(response => response.json())
        .then(data => {
          this.fetchedData = data
          this.renderChart(data, this.duration)
          this.loaded = true
        })
      }catch(e){
        console.log(e)
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>