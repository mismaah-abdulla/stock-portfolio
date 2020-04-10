<template>
  <v-container class="py-0">
    <v-card outlined>
      <v-card-title>Financial Summary</v-card-title>
        <v-switch class="pl-5 py-0 my-0" v-model="quarterly" label="Quarterly"></v-switch>
        <v-tabs height="30"
        v-model="tab"
        background-color="transparent"
        color="basil"
        center-active
        grow>
        <v-tab
          v-for="item in tabHeaders"
          :key="item"
          class="caption font-weight-bold">
          {{ item }}
        </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-row justify="center">
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>Gross Margin</td>
                    <td class="text--secondary">44.42%</td>
                    <td>Net Profit</td>
                    <td class="text--secondary">27.01%</td>
                  </tr>
                  <tr>
                    <td>Operating Margin</td>
                    <td class="text--secondary">44.42%</td>
                    <td>Return On Investment</td>
                    <td class="text--secondary">27.01%</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-row>
          <v-divider></v-divider>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr v-if="quarterly">
                  <th></th>
                  <th class="text-left" v-for="i in incomeTable" :key="i.date">{{i.date.substring(0,7)}}</th>
                </tr>
                <tr v-else>
                  <th></th>
                  <th class="text-left" v-for="i in incomeTable" :key="i.date">{{i.date.substring(0,4)}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Revenue</td>
                  <td v-for="i in incomeTable" :key="i.date" class="text--secondary">{{formatNumber(i.TotalRevenue)}}</td>
                </tr>
                <tr>
                  <td>Gross Profit</td>
                  <td v-for="i in incomeTable" :key="i.date" class="text--secondary">{{formatNumber(i.GrossProfit)}}</td>
                </tr>
                <tr>
                  <td>Operating Income</td>
                  <td v-for="i in incomeTable" :key="i.date" class="text--secondary">{{formatNumber(i.OperatingIncome)}}</td>
                </tr>
                <tr>
                  <td>Net Income</td>
                  <td v-for="i in incomeTable" :key="i.date" class="text--secondary">{{formatNumber(i.NetIncome)}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
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
export default {
  data: () => ({
    tabHeaders: ["Income Statement", "Balance Sheet", "Cash Flow Statement"],
    tab: null,
    quarterly: false,
    incomeTable: null,
  }),
  props: {
    financials: Object
  },
  methods: {
    assignQuarterly () {
      this.incomeTable = this.financials.Income.quarterly
    },
    assignYearly () {
      this.incomeTable = this.financials.Income.yearly
    },
    formatNumber (num) {
        if(!num) return "N/A"
        if(num>99999999 || num<-99999999) return (num/1000000000).toFixed(2)+"B"
        if(num>1000000 || num<-1000000) return (num/1000000).toFixed(2)+"M"
        return num
      },
  },
  watch: {
    quarterly: function () {
      if (this.quarterly == false){
        this.assignYearly()
      }
      if (this.quarterly == true){
        this.assignQuarterly()
      }
    }
  },
  mounted () {
    this.assignYearly()
  }
}
</script>

<style>
.v-slide-group__prev {
display: none !important;
}
.theme--light.v-data-table tbody tr:not(:last-child) td:not(.v-data-table__mobile-row) {
  border: none;
}
.theme--light.v-data-table thead tr:last-child th {
  border: none;
}
.v-data-table td, .v-data-table th {
  padding-right: 10px;
  padding-left: 10px;
}
</style>