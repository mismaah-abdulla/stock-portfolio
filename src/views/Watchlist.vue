<template>
<div class="Watchlist">
      <v-card class="pa-2">
       
      <v-card-title>
        <v-text-field
          v-model="search"
          clearable
          prepend-inner-icon=mdi-magnify
          color='white'
          label="Search Symbol"
          single-line
          solo-inverted
          hide-details
        ></v-text-field>
      </v-card-title>
    <!-- END OF SEARCH -->

    <!-- DATA TABLE -->
      <v-data-table
        :headers="computedHeaders"
        :items ="watchlist" 
        :search="search"
        hide-actions
        hide-default-footer
        fixed-header
        sort-by="symbol"
        @click:row="tablerowClick"
        group-by="category"  
      >

       <template v-slot:group.header="{items, isOpen, toggle}">
        <th colspan=6>
          <v-icon @click="toggle">
            {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>
          {{ items[0].category }}
        </th>
      </template>

      <template v-slot:item.chg_percent="{ item }">
        <v-chip :color="getColor(item.chg_percent)" dark>
          <v-icon left v-if="item.chg_percent>'0%'">mdi-menu-up</v-icon>
          <v-icon left v-else-if="item.chg_percent<'0%'">mdi-menu-down</v-icon>
          <v-icon left v-else>mdi-equal</v-icon>
          <div v-if="item.chg_percent>'0%'"> +{{item.chg_percent}}</div>
          <div v-else> {{item.chg_percent }}</div>
        </v-chip>
      </template>
        
      <template v-slot:item.action="{  }">
        <v-icon color='blue' style="horizontal-align: middle"
          small
          @click="dialog=true">
          mdi-trash-can-outline
        </v-icon>
      </template>
      </v-data-table>
    </v-card>
  <!-- END OF DATA TABLE-->

  <!-- DELETE DIALOG -->
    <v-dialog
        v-model="dialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">{{Newitem}}</v-card-title>
  
          <v-card-text>
            Are you sure you want to delete this symbol from watchlist?
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              color=primary
              text
              @click="dialog = false"
            >
              Cancel
            </v-btn>
  
            <v-btn
              color="error"
              depressed 
              @click="deleteItem(item)"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- END OF DELETE DIALOG -->

    <!-- ADD BUTTON -->



 <v-dialog v-model="dialog2" max-width="500px">
            <template v-slot:activator="{ on }">
             <v-btn v-if="$vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly" class="mx-2" v-on="on" fixed bottom left fab dark color="primary" >
               <v-icon dark>mdi-plus</v-icon>
               </v-btn>
             <v-btn v-if="!$vuetify.breakpoint.xsOnly && !$vuetify.breakpoint.smOnly" class="mx-2" v-on="on" fixed bottom right fab dark color="primary" >
                <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Add (Temp)</span>
              </v-card-title>
  <!-- HARD CORDED, RETRIEVE FROM DB -->
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete v-model="editedItem.symbol" :items="samplesymbol" label="Symbol" ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.category" :rules="strRules" clearable="true" label="Category" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.price" :rules="intRules" clearable="true"  prefix="$ " label="Price (USD)" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.chg" :rules="intRules" clearable="true" prefix="$ "  label="Change" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.chg_percent" :rules="intRules" clearable="true"  suffix=" %" label="Change (%)" ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue" text @click="close">Cancel</v-btn>
                <v-btn color="blue " text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

    <!-- END OF BUTTON -->
    

</div>

</template>

<script>
//import Footer from './components/Footer'

export default {
  name: 'Watchlist',
  components: {
    //Footer,
    

  },
 data: function() {
    return{
      search:'',hideEdit:true,drawer: null,
      dialog:false, delete_clicked: false,
      dialog2:false,
      
      menuItems:[
      {icon:"mdi-chart-areaspline",title:"Market", link:"/Market"},
      {icon:"mdi-binoculars",title:"Watchlist", link:"/watchlist"},
      {icon:"mdi-account-box-outline",title:"Portfolio",link:"/portfolio"},
      {icon:"mdi-newspaper",title:"News Feed", link:"/news"}
      ],

      samplesymbol:['AAPL', 'FB', 'GOGL'],

      headers: [
        {
          text: 'Symbol',
          align: 'start', 
          value: 'symbol',
        },
        { filterable: false,text: 'Price (USD)', value: 'price' },
        {  text: 'Change', value: 'chg' },
        { sortable:false, filterable: false, value: 'chg_percent' },
        { value: 'action', sortable: false },
        {text: "Category", value:"category",sortable:false, filterable: false}
      ],

      watchlist: [{
            price: "262.33",
            high: "264.29",
            low: "249.80",
            chg: "+1.96",
            chg_percent: "0.75%",
            dateTime: "2020-03-07 05:08:14",
            symbol: "BA",
            id: "1",
            category:"Airline"
        },
        {
            price: "95.32",
            high: "96.06",
            low: "93.42",
            chg: "-1.87",
            chg_percent: "-1.92%",
            dateTime: "2020-03-07 05:08:14",
            symbol: "CVX",
            id: "2",
            category:"Energy"
        }
      ],

      editedItem: {
        symbol: "",
        price: "",
        chg: "",
        chg_percent: "",
        category: "",
      },
      
      defaultItem: {
        symbol: "",
        price: "",
        chg: "",
        chg_percent: "",
        category: "",
      },

      strRules: [
        v => !!v || 'This field is required',
        v => (v && v.length <= 10) || 'Must be less than 10 characters',
      ],

      intRules: [
        v => !!v || 'This field is required',
        v => (v && v.length <= 10) || 'Must be less than 10 characters',
      ],
    }
 },

 methods:{
      editMode () {
        this.hideEdit = !(this.hideEdit)
      },

      deleteItem (item) {
        const index = this.watchlist.indexOf(item)
        this.dialog=false
        this.watchlist.splice(index, 1)
        this.hideEdit=true
      },
      
      getColor (change) {
        if (change < '0%') return 'red'
        else if (change >='0%') return 'green'
      },

      tablerowClick(value){
        if(this.hideEdit){
          alert("Going to " + value.symbol)
        }
      },
      
      close () {
        this.dialog2 = false
        this.editedItem =Object.assign({}, this.defaultItem)
        this.$refs.editedItem.reset()
      },

      save () {
        this.editedItem.chg_percent+="%"
        this.watchlist.push(this.editedItem)
        this.close()
      },
  },

 computed:{
      computedHeaders () {
      if(this.hideEdit){
        return this.headers.filter(header => header.value !== "action")
      }
      else{
      return this.headers}
      },


  },
}

</script>

<style>

</style>