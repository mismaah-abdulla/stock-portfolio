<template>
    <v-container fluid>
      <v-btn v-on:click="duration = 5">5D</v-btn>
      <GChart v-if="loaded"
      type="CandlestickChart"
      :data="stockData"
      :options="options"
      />
    </v-container>
</template>
<script>
import { GChart } from 'vue-google-charts'

export default {
  name: "Chart",
  components: {
    GChart,
  },
  props: {
    exchangeCode: String,
    symbol: String
  },
  data () {
    return {
      loaded: false,
      duration: 30,
      stockData: [['Date', 'Low - High, Open - Close', 'Null', 'Null', 'Null']],
      options: {
        legend: 'Intraday Stock',
        bar: { groupWidth: '100%' },
        candlestick: {
          fallingColor: { strokeWidth: 0, fill: '#a52714' },
          risingColor: { strokeWidth: 0, fill: '#0f9d58' }
        }
      }
    }
  },
  mounted () {
    this.loaded = false
    let eodAPI = `http://localhost/API/EOD/${this.$props.exchangeCode}/${this.$props.symbol}`
    try{
      fetch(eodAPI)
      .then(response => response.json())
      .then(data =>{
        for(let i = data.length-this.duration; i < data.length; i++){
          let moment = require('moment')
          let date = new Date(data[i].date)
          let daymonth = moment(new Date(date)).format("DD MMM")
          this.stockData.push([daymonth, data[i].low, data[i].open, data[i].close, data[i].high])
        }
        this.options = { 
          legend: 'none', 
          chartArea: {
            top: 50,
            left: 50,
            right: 50,
          },
          height: '500',
          // width: '2000',
          candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#a52714' },
            risingColor: { strokeWidth: 0, fill: '#0f9d58' }
          }
        }
        this.loaded = true
      })
    }catch(e){
      console.log(e)
    }
  }
}
</script>