<template>
  <div>
    <v-divider></v-divider>
    <v-row v-if="!loaded" class="py-5 my-5" justify="center">
      <v-progress-circular
        :size="70"
        :width="6"
        color="grey"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <v-row v-if="loaded" no-gutters>
      <v-col xs="12" cols=7>
        <v-card v-if="page=='Summary'" flat>
          <v-card-title class="pl-2 font-weight-bold">Summary</v-card-title>
          <v-simple-table divider dense>
            <template v-slot:default>
              <tbody>
                <tr v-for="item in items" :key="item.name">
                  <td width=55% class="caption pr-0">{{ item.name }}</td>
                  <td class="caption pl-0 font-weight-bold">{{ item.data }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>

      <v-col xs="12" class=pt-4>
        <v-row justify=end class="pr-2 py-1" >
            <v-btn v-if="page=='Summary'" x-small width=140 depressed color="green lighten-2"><span class="mr-11 pr-9">Summary</span></v-btn>
            <v-btn v-else @click="page='Summary'" text x-small width=140 depressed color="green darken-2"><span class="mr-11 pr-9">Summary</span></v-btn>
        </v-row>
        <v-row justify=end class="pr-2 py-1">
            <v-btn v-if="page=='Valuation'" x-small width=140 depressed color="green lighten-2"><span class="mr-10 pr-8">Valuation</span></v-btn>
            <v-btn v-else @click="page='Valuation'" text x-small width=140 depressed color="green darken-2"><span class="mr-10 pr-8">Valuation</span></v-btn>
        </v-row>
        <v-row justify=end class="pr-2 py-1">
            <v-btn v-if="page=='Financial'" x-small width=140 depressed color="green lighten-2"><span class="mr-1">Financial Highlights</span></v-btn>
            <v-btn v-else @click="page='Financial'" text x-small width=140 depressed color="green darken-2"><span class="mr-1">Financial Highlights</span></v-btn>
        </v-row>
        <v-row justify=end class="pr-2 py-1">
            <v-btn v-if="page=='Income'" x-small width=140 depressed color="green lighten-2"><span class="mr-5">Income Statement</span></v-btn>
            <v-btn v-else @click="page='Income'" text x-small width=140 depressed color="green darken-2"><span class="mr-5">Income Statement</span></v-btn>
        </v-row>
        <v-row justify=end class="pr-2 py-1">
            <v-btn v-if="page=='Balance'" x-small width=140 depressed color="green lighten-2"><span class="mr-11">Balance Sheet</span></v-btn>
            <v-btn v-else @click="page='Balance'" text x-small width=140 depressed color="green darken-2"><span class="mr-11">Balance Sheet</span></v-btn>
        </v-row>
        <v-row justify=end class="pr-2 py-1">
            <v-btn v-if="page=='Cashflow'" x-small width=140 depressed color="green lighten-2"><span class="mr-11 pr-7">Cashflow</span></v-btn>   
            <v-btn v-else @click="page='Cashflow'" text x-small width=140 depressed color="green darken-2"><span class="mr-11 pr-7">Cashflow</span></v-btn>   
        </v-row>
        <v-row justify=end class="pr-2 py-1">
            <v-btn v-if="page=='Trading'" x-small width=140 depressed color="green lighten-2"><span class="mr-0">Trading & Share Stats</span></v-btn>
            <v-btn v-else @click="page='Trading'" text x-small width=140 depressed color="green darken-2"><span class="mr-0">Trading & Share Stats</span></v-btn>
        </v-row>
        <v-row justify=end class="pr-2 py-1">
            <v-btn v-if="page=='Divident'" x-small width=140 depressed color="green lighten-2"><span class="mr-8">Divident & Spilts</span></v-btn>
            <v-btn v-else @click="page='Divident'" text x-small width=140 depressed color="green darken-2"><span class="mr-8">Divident & Spilts</span></v-btn>
        </v-row>
      </v-col>

      <v-col md="8" v-if="$vuetify.breakpoint.mdAndUp">
        <Financials :financials="financials"/>
      </v-col>
    </v-row>
    <v-card v-if="loaded" outlined class="mt-3">
      <v-row no-gutters>
        <v-col v-for="item in items3" :key="item.name" cols="4">
          <v-list two-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-wrap">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-wrap"> {{ item.data }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
    <v-row v-if="loaded && $vuetify.breakpoint.smAndDown" class="mt-3">
      <Financials :financials="financials"/>
    </v-row>
  </div>
</template>

<script>
import Financials from './Financials'
export default {
    name: "Stats",
    components: {
      Financials
    },
    data: () => ({
      page:'Summary',
      loaded: false,
      stats: null,
      financials: null,
      items: {
        prevClose: {name: "Prev Close", data: null},
        dayRange: {name: "Day's Range", data: null},
        weekRange: {name: "52 Week Range", data: null},
        eps: {name: "EPS", data: null},
        yearReturn: {name: "1-Year Return", data: null},
        beta: {name: "Beta", data: null},
        marketCap: {name: "Market Cap", data: null},
        peRatio: {name: "P/E Ratio", data: null},
        revenue: {name: "Revenue", data: null},
        avgVol: {name: "Avg. Volume (3m)", data: null},
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
        let stock = { code: localStorage.code, exchange: localStorage.exchange}
        let statsAPI = `http://${hostname}:5000/stats/${stock.code}.${stock.exchange}`
        try{
          fetch(statsAPI)
          .then(response =>{return response.json()})
          .then(data =>{
            this.assignStats(data)
            this.financials = data.Financials
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
        this.items.prevClose.data = data.PrevClose ? data.PrevClose : "N/A"
        this.items.dayRange.data = data.DayRange ? data.DayRange : "N/A"
        this.items.weekRange.data =  data.WeekRange52 ? data.WeekRange52 : "N/A"
        this.items.eps.data = data.EPS ? data.EPS : "N/A"
        this.items.yearReturn.data = data.YearReturn ? data.YearReturn : "N/A"
        this.items.beta.data = data.Beta ? data.Beta : "N/A"
        this.items.marketCap.data = this.formatNumber(data.MarketCap)
        this.items.peRatio.data = data.PERatio ? data.PERatio : "N/A"
        this.items.revenue.data = this.formatNumber(data.Revenue)
        this.items.avgVol.data = this.formatNumber(data.AvgVolume)
        this.items.dividend.data = data.Dividend ? data.Dividend : "N/A"
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
