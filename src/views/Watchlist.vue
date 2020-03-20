<template>
  <div>
    <v-card dense outlined color=transparent border-color=white class="px-2">
      
    <v-row align="center" class="pa-2">
    <!-- Watchlist select -->  
    <v-col cols="9">
        <v-select
        :items="watchlist_list"
        item-text="name"
        @change="watchlist_filter"
        label="Select Watchlist"
        dense
        single-line
        ></v-select>
    </v-col>
    <!-- END OF watchlist select-->  
        
    <!-- EDIT BUTTON -->
        <v-btn icon v-if="hideEdit&&selected_watchlist" @click='editMode'>
        <v-icon right>
          mdi-playlist-edit
        </v-icon>
        </v-btn>
        <v-btn icon v-else-if="selected_watchlist" @click='editMode'>
        <v-icon >
          mdi-playlist-check
        </v-icon>
        </v-btn>
        <v-btn icon v-else disabled >
        <v-icon >
          mdi-playlist-star
        </v-icon>
        </v-btn>
    <!-- END OF EDIT BUTTON -->
    
    <!-- DELETE WATCHLIST BUTTON -->   
    <v-dialog v-if="hideEdit&&selected_watchlist" v-model="dialog_deleteWatchlist" max-width="500px">
    <template  v-slot:activator="{ on }">
        <v-btn icon v-on="on">
        <v-icon>
          mdi-playlist-remove
        </v-icon>
        </v-btn>
    </template>
    <v-card>
        <v-card-title> 
          <span class="headline">Confirm Deletion</span>
        </v-card-title>
        <v-card-text>
           <span>Delete watchlist: {{selected_watchlist}}</span>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn color="default" text @click="close">Cancel</v-btn>
          <v-btn color="error" @click="delete_watchlist">Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> 
    </v-row>
    <!-- END OF DELETE WATCHLIST BUTTON --> 
    </v-card>

    <v-card outlined color=transparent border-color=white class="pa-1">
    
    <!-- DATA TABLE -->
    <v-data-table 
        v-if="selected_watchlist"
        :headers="computedHeaders"
        :items ="finalarray" 
        hide-default-footer
        fixed-header
        sort-by="symbol"
        @click:row="tablerowClick"
        group-by="category">

        <template slot="no-data" >
          <v-alert :value="true" icon="warning" class='pa-8'>
            Sorry, nothing to display here :(
          </v-alert>
        </template>

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
        
        <template v-slot:item.action="{}">
          <v-icon color='red' style="horizontal-align: middle"
            small
            @click="dialog=true">
            mdi-trash-can-outline
          </v-icon>
        </template>
    </v-data-table>
    </v-card>
    <!-- END OF DATA TABLE-->
    
    <!--ADD MARKET BUTTON UNDER TABLE-->
    <v-dialog v-if="selected_watchlist" v-model="add_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-card  v-on="on"  
            class="pa-3" color=transparent >
            <v-card-actions class="justify-center" >
            <v-icon  color='blue' >mdi-clipboard-plus</v-icon> 
            Add Markets 
            </v-card-actions >  
        </v-card>  
      </template>

      <v-card>
        <v-toolbar dark color="primary">
            <v-btn icon dark @click="add_dialog = false">
            <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Add Markets</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
      
        <v-text-field class="px-3"
            clearable
            prepend-inner-icon=mdi-magnify
            color='black'
            label="Search Markets"
            :items="symbols"
            item-text="symbol"
            single-line
        ></v-text-field>

      <v-list two-line >
              
              <v-list-item 
                  v-for="(symbol,index) in symbols"
                  :key="symbol.symbol"
                  ripple>
              <v-list-item-avatar>
                  <v-icon size="50">mdi-circle</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                  <v-list-item-title>{{ symbol.symbol }}</v-list-item-title>
                  <v-list-item-subtitle >{{ symbol.name }}</v-list-item-subtitle>
                  <v-divider v-if="index + 1 < symbols.length"
                  :key="index" ></v-divider>
              </v-list-item-content>

              <v-list-item-action >
                        <!-- <v-btn icon
                         color="grey lighten-1">
                          <v-icon color="green">mdi-checkbox-marked-circle</v-icon>
                        </v-btn> -->

                        <v-btn icon @click="addMarket(symbol)"
                         color="grey lighten-1">
                          <v-icon color="grey lighten-1">mdi-plus-circle-outline</v-icon>
                        </v-btn>
              </v-list-item-action>
            </v-list-item>
      </v-list>
 
      </v-card>
    </v-dialog>
    <!--END OF ADD MARKET -->
    

    <!-- DELETE SYMBOL DIALOG -->
    <v-dialog
      v-model="dialog"
      max-width="290">

      <v-card>
        <v-card-title class="headline"></v-card-title>
  
        <v-card-text>
          Are you sure you want to delete this symbol from: {{selected_watchlist}}?
        </v-card-text>
  
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color=primary
              text
              @click="dialog = false">
              Cancel
            </v-btn>

            <v-btn
              color="error"
              depressed 
              @click="deleteItem(item)">
              Delete
            </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END OF DELETE SYMBOL DIALOG -->
 
    <!-- ADD BUTTON -->
    <v-dialog v-model="dialog_addWatchlist" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn v-if="$vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly" class="mx-2" v-on="on"  fixed bottom left fab dark color="primary" >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
        <v-btn v-if="!$vuetify.breakpoint.xsOnly && !$vuetify.breakpoint.smOnly" class="mx-2" v-on="on"  fixed bottom right fab dark color="primary" >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title> 
          <span class="headline">New Watchlist</span>
        </v-card-title>

        <v-card-text>
          <v-container> 
            <v-text-field :rules="strRules" v-model="editedItem.name"  label="Watchlist Name" :hint="check_duplicate? 'Duplicate name exists' : ''" ></v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default" text @click="close">Cancel</v-btn>
          <v-btn class="white--text" color="blue" @click="save" v-bind:disabled="editedItem.name===''||check_duplicate" >Save</v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>
    <!-- END OF ADD BUTTON -->

  </div>
</template>

<script>

export default {
  name: 'Watchlist',
  components: {
  },
 data: function() {
    return{
      search: '', selected_watchlist:'',
      filtered_watchlist:'', 
      filtersymbolarray:[],
      finalarray:[],
      hideEdit: true,
      drawer: null,
      dialog: false,  add_dialog:false, list_item:false,
      delete_clicked: false, dialog_deleteWatchlist: false,
      dialog_addWatchlist: false, dialog_InvalidInput:false,
      menuItems: [
        {icon:"mdi-chart-areaspline",title:"Market", link:"/Market"},
        {icon:"mdi-binoculars",title:"Watchlist", link:"/watchlist"},
        {icon:"mdi-account-box-outline",title:"Portfolio",link:"/portfolio"},
        {icon:"mdi-newspaper",title:"News Feed", link:"/news"}
      ],
     
      headers: [
        {
          text: 'Symbol',
          align: 'start', 
          value: 'symbol',
        },
        { filterable: false,text: 'Price (USD)', value: 'price' },
        { text: 'Change', value: 'chg' },
        { sortable:false, filterable: false, value: 'chg_percent' },
        { value: 'action', sortable: false },
        { text: "Sector", value:"category",sortable:false, filterable: false}
      ],
      
      symbols: [{
            price: "262.33",
            high: "264.29",
            low: "249.80",
            chg: "+1.96",
            chg_percent: "0.75%",
            dateTime: "2020-03-07 05:08:14",
            symbol: "BA",
            id: "1",
            category:"Airline",
            name:"Boeing Co"
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
            category:"Energy",
            name:"Chevron Corporation"
        },
        {
            price: "146.01",
            high: "159.13",
            low: "143.10",
            chg: "−24.27",
            chg_percent: "-14.25%",
            dateTime: "2020-03-07 05:08:14",
            symbol: "FB",
            id: "3",
            category:"Tech",
            name:"Facebook, Inc. "
        }
      ],
 
      watchlist_list:[
      {
        name: "My Watchlist",
        symbol:["BA","CVX"]
      },
      {
        name: "Test1",
        symbol:["BA"]

      },
      {
        name: "Test2",
        symbol:["CVX"]

      }],
      editedItem: {
       name:"",
        symbol:[]
      },
      defaultItem: {
        name:"",
        symbol:[]
      },
      strRules: [
        v => !!v || 'This field is required',
      ],
    }
 },

 methods:{
      editMode () {
        this.hideEdit = !(this.hideEdit)
      },

      deleteItem (item) {
        const index = this.finalarray.indexOf(item)
        this.finalarray.splice(index, 1)
        this.hideEdit=true
        this.dialog=false
      },
      
      delete_watchlist(){
       this.dialog_deleteWatchlist = false
       for(var i=0;i<this.watchlist_list.length;i++){
         if(this.watchlist_list[i].name===this.selected_watchlist)
         { 
          this.watchlist_list.splice(i, 1)
          this.selected_watchlist=''
          break
         }
       }
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
        this.dialog_addWatchlist = false
        this.dialog_InvalidInput = false
        this.dialog_deleteWatchlist = false
        this.editedItem = Object.assign({}, this.defaultItem)
      },

      save () {
        if(this.editedItem.name===""){
        this.dialog_InvalidInput=true
        }
        else{this.watchlist_list.push(this.editedItem)
        this.close()
        }
      },

      watchlist_filter(value){
        this.selected_watchlist=value

        this.filtered_watchlist=this.watchlist_list.filter(item=>item.name === value )
        this.filtersymbolarray=(this.filtered_watchlist[0].symbol)

        var temp_symbols=this.symbols
        this.finalarray=[]
        
        for(var i=0;i<this.filtersymbolarray.length;i++){
        Array.prototype.push.apply(this.finalarray,(temp_symbols.filter(
        temp_symbol => temp_symbol.symbol === this.filtersymbolarray[i])
        ))
        }
      },

      addMarket(symbol){
        this.finalarray.push(symbol)
        console.log(this.finalarray)
        this.add_dialog=false
      }
 
  },

  computed:{
      computedHeaders () {
      if(this.hideEdit){
        return this.headers.filter(
          header => header.value !== "action")
      }
      else{
        return this.headers}
      },
     
      check_duplicate()
      {
        for(var i=0;i<this.watchlist_list.length;i++){
         if(this.watchlist_list[i].name.trim().toLowerCase()===this.editedItem.name.trim().toLowerCase())
         { 
          return true
         }
       }
       return false},

    },
    
    
}
</script>