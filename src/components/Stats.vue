<template>
  <v-container>
    <v-card outlined> 
      <v-card-title>Overview</v-card-title>
      <v-row no-gutters>
        <v-col class="flex-grow-0 flex-shrink-1">
          <v-list two-line subheader>
            <v-list-item v-for="item in overviewItems1" :key="item.data">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle> {{ item.data }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <v-list two-line subheader>
            <v-list-item v-for="item in overviewItems2" :key="item.data">
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
    data: () => ({
      overviewItems1: [
      {name: "Prev Close", data: "123"},
      {name: "Day's Range", data: "122"},
      {name: "52 Week Range", data: "121"},
      {name: "Average Volume (3m)", data: "223"},
      {name: "1-Year Return", data: "323"},
    ],
      overviewItems2: [
      {name: "Market Cap", data: "123"},
      {name: "P/E Ratio", data: "122"},
      {name: "Revenue", data: "121"},
      {name: "EPS", data: "223"},
      {name: "Dividend (Yield)", data: "323"},
    ],
    })
    
}
</script>