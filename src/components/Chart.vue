<template>
  <div class="chart">
    <line-chart 
    v-if="loaded"
    :chart-data="stockData"
    :options="options"/>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'
  export default {
      name: 'Chart',
      components: {
        LineChart
        },
      data () {
        return {
          loaded: false,
          stockData: {
            labels: [],
            datasets: [{
              label: 'EPS',
              data: null,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false,
                }
              }]
            }
          }
        }
      },
      mounted () {
        this.loaded = false
        try{
          fetch('http://localhost/AAPL')
          .then(response => response.json())
          .then(data =>{
            // console.log(data)
            // this.stockData.labels = Object.values(data.Earnings.Annual).map(x => x.date)
            // this.stockData.datasets.data = Object.values(data.Earnings.Annual).map(x => x.epsActual)
            this.stockData = {
              labels: Object.values(data.Earnings.Annual).map(x => x.date),
              datasets: [{
                label: data.General.Name,
                data: Object.values(data.Earnings.Annual).map(x => x.epsActual),
                borderColor: [
                  'rgba(4, 4, 42, 1)',
                  'rgba(4, 4, 42, 1)',
                ],
                borderWidth: 2
              }]
            }
            console.log(this.stockData.datasets.data)
            this.loaded = true
          })
        }catch(e){
          console.log(e)
        }
      }
  }
</script>

<style>
  .chart{
    height: 200px !important;
    align-content: center;
    justify-content: center;
  }
</style>