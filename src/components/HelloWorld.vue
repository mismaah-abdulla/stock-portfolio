<template>
  <div>
    <line-chart :chart-data="datacollection"></line-chart>
    <button @click="fillData()">Randomize</button>
  </div>
</template>

<script>
import LineChart from './LineChart.js'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null
    }
  },
  mounted() {
    this.fillData()
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: ['Data'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#026979',
            data: [this.getRandomInt()]
          }, 
          {
            label: 'Data Two',
            backgroundColor: '#f20979',
            data: [this.getRandomInt()]
          },
          {
            label: 'Data Three',
            backgroundColor: '#f99999',
            data: [this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt(){
      return Math.floor(Math.random() * (50 - 5 + 1 )) + 5
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div{
  width: 50%;
  height: 50%;
}
</style>
