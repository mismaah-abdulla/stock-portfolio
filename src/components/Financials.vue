<template>
  <v-container class="py-0">
    <v-card outlined>
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
          fixed
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
export default {
  data: () => ({
    tabHeaders: ["Income Statement", "Balance Sheet", "Cash Flow Statement"],
    tab: null,
    quarterly: false,
  })
}
</script>