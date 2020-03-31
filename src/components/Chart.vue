<template>
    <v-container fluid fill-height>
      <v-row v-if="$vuetify.breakpoint.xsOnly" justify="center">
        <div class="px-1" v-for="button in buttons" :key="button.duration">
          <v-btn small outlined @click="renderChart(fetchedData, button.duration)">{{ button.text }}</v-btn>
        </div>
      </v-row>
      <v-row v-if="!$vuetify.breakpoint.xsOnly" justify="center">
        <div class="px-2 " v-for="button in buttons" :key="button.duration">
          <v-btn outlined @click="renderChart(fetchedData, button.duration)">{{ button.text }}</v-btn>
        </div>
      </v-row>
      <v-row v-if="!loaded" class="pt-5 mt-5" justify="center">
        <v-progress-circular
          :size="70"
          :width="6"
          color="grey"
          indeterminate
        ></v-progress-circular>
      </v-row>
      <v-row v-if="loaded">
        <v-col cols="12">
        <GChart 
        type="CandlestickChart"
        :data="stockData"
        :options="options"
        />
        </v-col>
      </v-row>
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
    stock: Object
  },
  data () {
    return {
      loaded: false,
      buttons: [{duration: 7, text: "7D"},{duration: 20, text: "1M"},{duration: 60, text: "3M"},{duration: 120, text: "6M"},{duration: 252, text: "1Y"}],
      duration: 20,
      stockData: null,
      options: null,
      fetchedData: null
    }
  },
  methods: {
    renderChart(data, duration) {
      this.stockData = [['Date', 'Low - High, Open - Close', 'Null', 'Null', 'Null']]
      if (duration > data.length) duration = data.length
      for(let i = data.length-duration; i < data.length; i++){
        let moment = require('moment')
        let date = new Date(data[i].date)
        if(date.getFullYear() >= new Date().getFullYear()-1){
          let daymonth = moment(new Date(date)).format("DD MMM")
          this.stockData.push([daymonth, data[i].low, data[i].open, data[i].close, data[i].high])
        }
      }
      this.options = { 
        legend: 'none', 
        chartArea: {
          top: 20,
          left: 50,
          right: 50,
        },
        height: '500',
        candlestick: {
          fallingColor: { strokeWidth: 0, fill: '#a52714' },
          risingColor: { strokeWidth: 0, fill: '#0f9d58' }
        }
      }
    },
    getData(){
      this.loaded = false
      let hostname = window.location.hostname
      let eodAPI = `http://${hostname}:5000/eod/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
      try{
        fetch(eodAPI)
        .then(response => response.json())
        .then(data =>{
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