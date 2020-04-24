<template>
  <div id="container"></div>
</template>

<script>
export default {
  name: "StockMap",
  props: {
    stock: Object
  },
  mounted () {
    let stock = this.$props.stock
    let Highcharts = require('highcharts')
    require('highcharts/modules/export-data')(Highcharts)
    require('highcharts/modules/accessibility')(Highcharts)
    require('highcharts/modules/boost')(Highcharts)
    Highcharts.getJSON(
    `http://localhost:5000/stockmap/${stock.Code}.${stock.Exchange}`,
    function (data) {
      console.log(stock.Code)
      const getSector = (Sector) => {
        let temp = []
        data.forEach((i) => {
          if(Sector == i.sector && i.symbol != stock.Code){
            temp.push({x: i.volatility, y: i.return, symbol: i.symbol})
          }
        })
        return temp
      }
      const getOther = (Sector) => {
        let temp = []
        data.forEach((i) => {
          if(Sector != i.sector && i.symbol != stock.Code){
            temp.push({x: i.volatility, y: i.return, symbol: i.symbol})
          }
        })
        return temp
      }
      const getSelected = () => {
        let temp = []
        data.forEach((i) => {
          if(i.symbol == stock.Code){
            temp.push({x: i.volatility, y: i.return, symbol: i.symbol})
          }
        })
        return temp
      }
      let series = []
      series.push({
        name: 'Apple Inc',
        data: getSelected(),
        color: '#ff0000',
        marker:{
          radius: 10,
        },
        opacity: 1
      })
      console.log(series)
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
      Highcharts.chart("container", {
        credits: {
          enabled: false
        },
        chart: {
          type: "scatter",
          zoomType: "xy",
          events: {
            load: function () {
              this.series.forEach((s) => {
                s.setState("hover");
                s.setState("");
              });
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
      });
    }
  );
  }
}
</script>