<template>
  <v-container>
    <v-row v-if="!loaded" class="py-5 my-5" justify="center">
      <v-progress-circular
        :size="70"
        :width="6"
        color="grey"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <v-card v-if="loaded" outlined> 
      <v-card-title>Overview</v-card-title>
      <v-row  no-gutters>
        <v-col xs="6" lg="2">
          <v-list two-line subheader>
            <v-list-item v-for="item in items1" :key="item.name">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle> {{ item.data }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col xs="6" lg="2">
          <v-list two-line subheader>
            <v-list-item v-for="item in items2" :key="item.name">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle> {{ item.data }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col xs="11" lg="8" class="pr-2">
          <LChart :stock="this.$props.stock"></LChart>
        </v-col>
      </v-row>
      <!-- <v-row v-if="$vuetify.breakpoint.xsOnly || $vuetify.breakpoint.xsOnly" class="pr-1">
        <v-col cols="12">
          <LChart :stock="this.$props.stock"></LChart>
        </v-col>
      </v-row> -->
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
    <v-card outlined class="mt-5" v-if="loaded">
      <v-card-title>Financial Summary</v-card-title>
        <v-switch class="pl-5 py-0 my-0" v-model="quarterly" label="Quarterly"></v-switch>
        <v-tabs slider-size="1" height="30"
        v-model="tab"
        background-color="transparent"
        color="basil"
        >
        <v-tab dense 
          v-for="item in tabHeaders"
          :key="item"
          class="caption font-weight-bold"
          
        >
          {{ item }}
        </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
        <v-tab-item>
          
        </v-tab-item>
        <v-tab-item>
          
        </v-tab-item>
        <v-tab-item>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import LChart from './LChart'
export default {
    name: "Stats",
    props: {
      stock: Object,
    },
    components: {
      LChart
    },
    data: () => ({
      loaded: false,
      tabHeaders: ["Income Statement", "Balance Sheet", "Cash Flow Statement"],
      tab: null,
      stats: null,
      quarterly: false,
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
        sector: {name: "Sector", data: null},
        industry: {name: "Industry", data: null},
        employees: {name: "Employees", data: null},
      }
    }),
    methods: {
      fetchStats () {
        this.loaded = false
        let hostname = window.location.hostname
        let statsAPI = `http://${hostname}:5000/stats/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
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
        this.items1.prevClose.data = data.PrevClose ? data.PrevClose : "N/A"
        this.items1.dayRange.data = data.DayRange ? data.DayRange : "N/A"
        this.items1.weekRange.data =  data.WeekRange52 ? data.WeekRange52 : "N/A"
        this.items1.avgVol.data = this.formatNumber(data.AvgVolume)
        this.items1.yearReturn.data = data.YearReturn ? data.YearReturn : "N/A"
        this.items1.beta.data = data.Beta ? data.Beta : "N/A"
        this.items2.marketCap.data = this.formatNumber(data.MarketCap)
        this.items2.peRatio.data = data.PERatio ? data.PERatio : "N/A"
        this.items2.revenue.data = this.formatNumber(data.Revenue)
        this.items2.eps.data = data.EPS ? data.EPS : "N/A"
        this.items2.dividend.data = data.Dividend ? data.Dividend : "N/A"
        this.items3.sector.data = data.Sector ? data.Sector : "N/A"
        this.items3.industry.data = data.Industry ? data.Industry : "N/A"
        this.items3.employees.data = data.Employees ? data.Employees : "N/A"
      },
      formatNumber (num) {
        if(!num) return "N/A"
        if(num>1000000000) return (num/1000000000).toFixed(2)+"B"
        if(num>1000000) return (num/1000000).toFixed(2)+"M"
        return num
      },
      assignNull () {
        /* eslint-disable no-unused-vars */
        for(let [key, value] of Object.entries(this.items1)){
          value.data = "N/A"
        }
        for(let [key, value] of Object.entries(this.items2)){
          value.data = "N/A"
        }
        /* eslint-disable no-unused-vars */
      }
    },
    mounted () {
      this.fetchStats()
    }
    
}
</script>