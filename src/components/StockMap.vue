<template>
  <div id="container"></div>
</template>

<script>
export default {
  name: "StockMap",
  mounted () {
    let Highcharts = require('highcharts')
    require('highcharts/modules/export-data')(Highcharts)
    require('highcharts/modules/accessibility')(Highcharts)
    require('highcharts/modules/boost')(Highcharts)
    let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js')
      document.head.appendChild(recaptchaScript)
      let sectors = [
    {
      name: "Technology",
      data: "Technology"
    },
    {
      name: "Healthcare",
      data: "Healthcare"
    },
    {
      name: "Financial Services",
      data: "Financial Services"
    },
    {
      name: "Industrials",
      data: "Industrials"
    },
    {
      name: "Other",
      data: "Other"
    },
    {
      name: "Real Estate",
      data: "Real Estate"
    },
    {
      name: "Consumer Cyclical",
      data: "Consumer Cyclical"
    },
  ]
  Highcharts.getJSON(
    "http://localhost:5000/stockmap",
    function (data) {
      const getData = (Sector) => {
        let temp = []
        data.forEach((elm) => {
          if(Sector == elm.Sector){
            temp.push({x: elm.Volatility, y: elm.Return, symbol: elm.Symbol})
          }
        })
        return temp
      };
      let series = []
      sectors.forEach((e) => {
        series.push({
          name: e.name,
          data: getData(e.data)
        });
      });

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