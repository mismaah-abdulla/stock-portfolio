<template>
  <div v-touch="{
    down: () => swipe('down'),
    right: () => swipe('right'),
    left: () => swipe('left')
    }"
  >
    <transition name="slide">
    <v-row v-if="refresh" class="pt-5 mt-5" justify="center">
        <v-progress-circular
          :size="50"
          :width="5"
          color="grey"
          indeterminate>
        </v-progress-circular>
    </v-row>
    </transition>
    <v-row v-if="(!loadedY || !loadedD) && !refresh" class="pt-5 mt-5" justify="center">
        <v-progress-circular
          :size="50"
          :width="5"
          color="grey"
          indeterminate>
        </v-progress-circular>
    </v-row>
    <v-row v-if="loadedY && loadedD" class="pt-0 mt-0">
      <v-col cols="2" v-if="year==0">
        <v-row justify="end"  class="pb-0 mb-0 pt-3 mt-3">
          <span class="subtitle-1 font-weight-bold">{{fetchedData.WeekHigh52.toFixed(2)}}</span>
        </v-row>
        <v-row justify="end" class="pt-0 mt-0 pb-4">
          <span class="caption font-weight-light">52Wk Hi</span>
        </v-row>
        <v-row justify="end" class="pt-4 pb-0 mb-0">
          <span class="subtitle-1 font-weight-bold">{{fetchedData.WeekLow52.toFixed(2)}}</span>
        </v-row>
        <v-row justify="end" class="pt-0 mt-0">
          <span class="caption font-weight-light">52Wk Lo</span>
        </v-row>
      </v-col>
      <v-col cols="2" v-if="year==1">
        <v-row justify="end"  class="pb-0 mb-0 pt-2 mt-2">
          <span class="subtitle-1 font-weight-bold">{{fetchedData.high.toFixed(2)}}</span>
        </v-row>
        <v-row justify="end" class="pt-0 mt-0 pb-2">
          <span class="caption font-weight-light">Day Hi</span>
        </v-row>
        <v-row justify="end" class="pt-2 pb-0 mb-0">
          <span class="subtitle-1 font-weight-bold">{{fetchedData.open.toFixed(2)}}</span>
        </v-row>
        <v-row justify="end" class="pt-0 mt-0 pb-2">
          <span class="caption font-weight-light">Day Open</span>
        </v-row>
        <v-row justify="end" class="pt-2 pb-0 mb-0">
          <span class="subtitle-1 font-weight-bold">{{fetchedData.low.toFixed(2)}}</span>
        </v-row>
        <v-row justify="end" class="pt-0 mt-0">
          <span class="caption font-weight-light">Day Lo</span>
        </v-row>
      </v-col>
      <v-col cols="7" v-if="year==0">
        <GChart
        type="LineChart"
        :data="stockData"
        :options="options"
        />
      </v-col>
      <v-col cols="7" v-if="year==1">
        <GChart
        type="LineChart"
        :data="dayData"
        :options="options"
        />
      </v-col>
      <v-col cols="3">
        <v-row justify="start"  class="pb-0 mb-0 pt-5 mt-5">
          <span class="headline">{{fetchedData.close.toFixed(2)}}</span>
        </v-row>
        <v-row justify="start" class="py-0 my-0">
          <span class="caption font-weight-light">Current price ({{fetchedData.currency}})</span>
        </v-row>
        <v-row justify="start" class="py-0 my-0">
          <span class="caption font-weight-light"><v-icon>arrow_drop_up</v-icon>+ 0.15 + 1.00%</span>
        </v-row>
      </v-col>
    </v-row>  
    <v-row v-if="loadedY && loadedD" justify="center">
      <v-btn-toggle mandatory v-model="year">
        <v-btn x-small outlined>Year</v-btn>
        <v-btn x-small outlined>Day</v-btn>
      </v-btn-toggle>
    </v-row>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
import Touch from 'vuetify/es5/directives/touch'
export default {
  name: "ChartYD",
  components: {
    GChart,
  },
  props: {
    stock: Object,
    tab: Number,
  },
  directives: {
    Touch
  },
  data: () => ({
    loadedY: false,
    loadedD: false,
    stockData: null,
    dayData: null,
    fetchedData: null,
    fetchedDay: null,
    options: {
        legend: 'none',
        vAxis: {
          textPosition: 'none'
        },
        chartArea: {
          top: 20,
          bottom: 40,
          width: '100%'
        },
        height: '200',
      },
    year: 0,
    refresh: false
  }),
  methods: {
    getData () {
      this.loadedY = false
      this.loadedD = false
      let hostname = window.location.hostname
      let ydAPI = `http://${hostname}:5000/yd/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
      try{
        fetch(ydAPI)
        .then(response => response.json())
        .then(data => {
          this.fetchedData = data
          this.renderChartY(data.pastYear)
          this.loadedY = true
        })
      }
      catch(e){
        console.log(e)
      }
      let dayAPI = `http://${hostname}:5000/intraday/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
      try{
        fetch(dayAPI)
        .then(response => response.json())
        .then(data => {
          this.fetchedDay = data
          this.renderChartD(data)
          this.loadedD = true
        })
      }
      catch(e){
        console.log(e)
      }
    },
    renderChartY (data){
      this.stockData = [['Date', '']]
      for(let i in data){
        let moment = require('moment')
        let date = new Date(data[i].date)
        let month = moment(new Date(date)).format("MMM")
        this.stockData.push([month, data[i].aclose])
      }
    },
    renderChartD (data){
      this.dayData = [['Date', '']]
      for(let i in data){
        let moment = require('moment')
        let time = moment.unix(data[i].timestamp).format("hh:mm A")
        this.dayData.push([time, data[i].close])
      }
    },
    swipe (direction) {
      if (direction == 'down') {
        this.getData()
        this.refresh = true
      }
      if (direction == 'left') {
        if (this.year != 1) this.year = 1
      }
      if (direction == 'right') {
        if (this.year != 0) this.year = 0
      }
    },
  },
  mounted(){
    this.getData()
  },
  watch: {
    tab: function(){
      if(this.fetchedData){
        this.year = 1
      }
    },
    loadedY: function(){
      if (this.loadedY && this.loadedD) this.refresh = false
    },
    loadedD: function(){
      if (this.loadedY && this.loadedD) this.refresh = false
    }
  }
}
</script>

<style>
.slide-enter-active {
  transition: all .3s cubic-bezier(1,1,.5,.5);
}
/* .slide-leave-active {
  transition: all .3s cubic-bezier(1,1,.5,.5);
} */
.slide-enter{
  transform: translateY(-30px);
  /* opacity: 0; */
}
</style>