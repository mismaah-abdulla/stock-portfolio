<template>
    <GChart v-if="loaded"
    type="CandlestickChart"
    :data="stockData"
    :options="options"
    />
</template>
<script>
import { GChart } from 'vue-google-charts'
export default {
  components: {
    GChart,
  },
  data () {
    return {
      loaded: false,
      stockData: [['Date', 'OHLC', 'Null', 'Null', 'Null']],
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
    let eodAPI = 'http://localhost/AAPLeod'
    try{
      fetch(eodAPI)
      .then(response => response.json())
      .then(data =>{
        console.log(data)
        for(let i = data.length-30; i < data.length; i++){
          let moment = require('moment')
          let date = new Date(data[i].date)
          let daymonth = moment(new Date(date)).format("DD MMM")
          this.stockData.push([daymonth, data[i].low, data[i].open, data[i].close, data[i].high])
        }
        this.options = {  
          height: '600',
          legend: 'none',
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