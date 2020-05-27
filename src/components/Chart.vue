<template>
  <div id="parent">
    <div id="container"></div>
    <div id="container2"></div>
    <div id="container3"></div>
  </div>
</template>

<script>
import { getId } from '../utils'
export default {
  name: "Chart",
  data: () => ({
    loaded: null,
    user_id:'',
  }),
  mounted () {
    this.user_id = getId()
    let stock = { code: localStorage.code, exchange: localStorage.exchange, logo: localStorage.logoURL, name: localStorage.name }
    let hostname = window.location.hostname
    let Highcharts = require('highcharts')
    require('highcharts/modules/stock')(Highcharts)
    require('highcharts/modules/data')(Highcharts)
    require('highcharts/modules/drag-panes')(Highcharts)
    require('highcharts/modules/exporting')(Highcharts)
    require('highcharts/modules/export-data')(Highcharts)
    require('highcharts/modules/accessibility')(Highcharts)
    require('highcharts/modules/boost')(Highcharts)
    Highcharts.getJSON(`http://${hostname}:5000/chart/${this.user_id}/${stock.code}.${stock.exchange}`, function (data) {
      // split the data set into ohlc and volume
      var ohlc = [],
          volume = [],
          dataLength = data.length,
          // set the allowed units for data grouping
          groupingUnits = [[
              'week',                         // unit name
              [1]                             // allowed multiples
          ], [
              'month',
              [1, 2, 3, 4, 6]
          ]],

          i = 0

      for (i; i < dataLength; i += 1) {
          ohlc.push([
              data[i][0], // the date
              data[i][1], // open
              data[i][2], // high
              data[i][3], // low
              data[i][4] // close
          ])

          volume.push([
              data[i][0], // the date
              data[i][5] // the volume
          ])
      }
      // create the chart
      Highcharts.stockChart('container', {
        // chart: {
        //   height: 250
        // },
          rangeSelector: {
              selected: 1
          },
          title: {
              text: ''
          },
          yAxis: [{
              labels: {
                  align: 'right',
                  x: -3
              },
              title: {
                  text: 'OHLC'
              },
              height: '70%',
              lineWidth: 2,
              resize: {
                  enabled: true
              }
          }, {
              labels: {
                  align: 'right',
                  x: -3
              },
              title: {
                  text: 'Volume'
              },
              top: '65%',
              height: '30%',
              offset: 0,
              lineWidth: 2
          }],
          tooltip: {
              split: true
          },
          navigator: {
            enabled: false
          },
          scrollbar: {
            enabled: false
          },
          series: [{
              type: 'candlestick',
              name: stock.code,
              data: ohlc,
              dataGrouping: {
                  units: groupingUnits
              }
          }, {
              type: 'column',
              name: 'Volume',
              data: volume,
              yAxis: 1,
              dataGrouping: {
                  units: groupingUnits
              }
          }]
      })
  })
    Highcharts.getJSON(
        `http://${hostname}:5000/stockmap/${this.user_id}/${stock.code}.${stock.exchange}`,
        function (data) {
        console.log(stock.code)
        const getSector = (Sector) => {
            let temp = []
            data.forEach((i) => {
            if(Sector == i.sector && i.symbol != stock.code){
                temp.push({x: i.volatility, y: i.return, symbol: i.symbol})
            }
            })
            return temp
        }
        const getOther = (Sector) => {
            let temp = []
            data.forEach((i) => {
            if(Sector != i.sector && i.symbol != stock.code){
                temp.push({x: i.volatility, y: i.return, symbol: i.symbol})
            }
            })
            return temp
        }
        const getSelected = () => {
            let temp = []
            data.forEach((i) => {
            if(i.symbol == stock.code){
                temp.push({x: i.volatility, y: i.return, symbol: i.symbol})
            }
            })
            return temp
        }
        let series = []
        series.push({
            name: stock.name,
            data: getSelected(),
            color: '#ff0000',
            marker:{
            radius: 10,
            },
            opacity: 1
        })
        series.push({
            name: 'Technology',
            data: getSector('Technology'),
            color: '#32CD32'
        })
        series.push({
            name: '',
            data: getOther('Technology'),
            turboThreshold: 2000,
            color: '#808080',
            marker: {
            states: {
                hover: {
                enabled: false,
                }
            }
            }
        })
        Highcharts.chart("container3", {
            credits: {
            enabled: false
            },
            chart: {
            type: "scatter",
            zoomType: "xy",
            events: {
                load: function () {
                this.series.forEach((s) => {
                    s.setState("hover")
                    s.setState("")
                })
                }
            }
            },
            title: {
            text: ""
            },
            xAxis: {
            title: {
                text: "Volatility"
            },
            labels: {
                format: "{value}%"
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
            },
            yAxis: {
            title: {
                text: "Return"
            },
            labels: {
                format: "{value}%"
            }
            },
            legend: {
            enabled: true
            },
            plotOptions: {
            scatter: {
                opacity: 0.8,
                marker: {
                radius: 5,
                symbol: "circle",
                states: {
                    hover: {
                    enabled: true,
                    lineColor: "rgb(100,100,100)"
                    }
                }
                },
                states: {
                hover: {
                    marker: {
                    enabled: false
                    }
                }
                }
            }
            },
            tooltip: {
            pointFormat: "{point.symbol}<br/>Volatility: {point.x}% <br/> Return: {point.y}%"
            },
            series: series
        })
        }
    )
  }
}
</script>

<style>
#parent {
    height: 74vh;
}
#container {
    height: 50%;
}
#container3 {
    height: 50%;
}
</style>