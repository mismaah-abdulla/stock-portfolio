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
            elements: {
              line: {
                tension: 0
              }
            },
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
          fetch('http://localhost/BABA')
          .then(response => response.json())
          .then(data =>{
            this.stockData = {
              labels: Object.values(data.Earnings.Annual).reverse().map(x => x.date),
              datasets: [{
                label: data.General.Name,
                data: Object.values(data.Earnings.Annual).reverse().map(x => x.epsActual),
                borderColor: [
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