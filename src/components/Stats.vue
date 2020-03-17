<template>
  <v-container>
    <v-card outlined> 
      <v-card-title>Overview</v-card-title>
      <v-row v-if="!loaded" class="py-5 my-5" justify="center">
        <v-progress-circular
          :size="70"
          :width="6"
          color="grey"
          indeterminate
        ></v-progress-circular>
      </v-row>
      <v-row v-if="loaded" no-gutters>
        <v-col class="flex-grow-0 flex-shrink-1">
          <v-list two-line subheader>
            <v-list-item v-for="item in items1" :key="item.name">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle> {{ item.data }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1">
          <v-list two-line subheader>
            <v-list-item v-for="item in items2" :key="item.name">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle> {{ item.data }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider v-if="loaded"></v-divider>
      <v-row v-if="loaded">
        <v-col v-for="item in items3" :key="item.name">
          <v-list two-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle> {{ item.data }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
    name: "Stats",
    props: {
      stock: Object,
    },
    data: () => ({
      loaded: false,
      stats: null,
      items1: {
        prevClose: {name: "Prev Close", data: null},
        dayRange: {name: "Day's Range", data: null},
        weekRange: {name: "52 Week Range", data: null},
        avgVol: {name: "Average Volume (3m)", data: null},
        yearReturn: {name: "1-Year Return", data: null},
        beta: {name: "Beta", data: null}
      },
      items2: {
        marketCap: {name: "Market Cap", data: null},
        peRatio: {name: "P/E Ratio", data: null},
        revenue: {name: "Revenue", data: null},
        eps: {name: "EPS", data: null},
        dividend: {name: "Dividend (Yield)", data: null},
      },
      items3: {
        sector: {name: "Sector", data: "Stufffffff"},
        industry: {name: "Industry", data: "Stufffffff"},
        employees: {name: "Employees", data: "Stufffffff"},
      }
    }),
    methods: {
      fetchStats () {
        this.loaded = false
        let hostname = window.location.hostname
        let statsAPI = `http://${hostname}/backend/stats/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
        try{
          fetch(statsAPI)
          .then(response =>{return response.json()})
          .then(data =>{
            this.assignStats(data)
            this.loaded = true
          })
          .catch(e => {
            console.log("Response status: "+e)
            this.loaded = true
          })
        }catch(error){
          this.assignNull()
          console.log(error)
        }
      },
      assignStats (data) {
        this.items1.prevClose.data = data.PrevClose ? data.PrevClose : "n/a"
        this.items1.dayRange.data = data.DayRange ? data.DayRange : "n/a"
        this.items1.weekRange.data =  data.WeekRange52 ? data.WeekRange52 : "n/a"
        this.items1.avgVol.data = this.formatNumber(data.AvgVolume)
        this.items1.yearReturn.data = data.YearReturn ? data.YearReturn : "n/a"
        this.items1.beta.data = data.Beta ? data.Beta : "n/a"
        this.items2.marketCap.data = this.formatNumber(data.MarketCap)
        this.items2.peRatio.data = data.PERatio ? data.PERatio : "n/a"
        this.items2.revenue.data = this.formatNumber(data.Revenue)
        this.items2.eps.data = data.EPS ? data.EPS : "n/a"
        this.items2.dividend.data = data.Dividend ? data.Dividend : "n/a"
      },
      formatNumber (num) {
        if(!num) return "n/a"
        if(num>1000000000) return (num/1000000000).toFixed(2)+"B"
        if(num>1000000) return (num/1000000).toFixed(2)+"M"
        return num
      },
      assignNull () {
        /* eslint-disable no-unused-vars */
        for(let [key, value] of Object.entries(this.items1)){
          value.data = "n/a"
        }
        for(let [key, value] of Object.entries(this.items2)){
          value.data = "n/a"
        }
        /* eslint-disable no-unused-vars */
      }
    },
    mounted () {
      this.fetchStats()
    }
    
}
</script>