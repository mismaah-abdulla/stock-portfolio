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

    <v-container fluid>
        <v-card flat v-if="info">    
            <v-row dense class=py-0>
              <v-col cols=1><v-icon>mdi-earth</v-icon></v-col> 
              <v-col class=pl-2><span class="caption"> {{info.WebURL}} </span></v-col>
            </v-row>
            <v-row dense class=py-0>
              <v-col cols=1><v-icon>mdi-phone</v-icon></v-col> 
              <v-col class=pl-2><span class="caption"> {{info.Phone}} </span></v-col>
            </v-row>
            <v-row dense class=py-0>
              <v-col cols=1><v-icon>mdi-map-marker</v-icon></v-col>
              <v-col class=pl-2><span class="caption"> {{info.Address}} </span> </v-col> 
            </v-row>
            <v-row dense class="pt-3 pl-1"><span class="subtitle-2"> Company Info </span></v-row>
            <v-card-subtitle v-if="overflow==false&&info" class="px-0 caption text-justify" > {{info.Description.slice(0, 200)}}... </v-card-subtitle>
            <v-card-subtitle v-if="overflow==true&&info" class="px-0 caption text-justify" > {{info.Description}} </v-card-subtitle>
            <v-row v-if="overflow==false" class=px-5 justify=end ><i class="caption blue--text" @click="overflow=true" > Read More » </i> </v-row>
            <v-row v-else class=px-5 justify=end ><i class="caption blue--text" @click="overflow=false" >« Read Less  </i> </v-row>

            <v-row dense class="pt-3 py-2 pl-1"><span class="subtitle-2"> Key Executives </span></v-row>
            <div v-for="item in info.Officers" :key=item.Name>
              <v-row  dense class="py-1 pb-2 pl-0 caption"> 
                <v-col>{{item.Name}}</v-col>
                <v-col><v-card-subtitle class="py-0 caption text-justify">{{item.Title}}</v-card-subtitle></v-col>
              </v-row>
            </div>
        </v-card>
    </v-container>
    
  </div>
</template>

<script>
import store from '../store'
import authHeader from '../services/auth-header'
import { getId } from '../utils'
export default {
    name: "About",

    data: () => ({
        stock: null,
        loaded: false,
        info: null,
        overflow:false,
        description: '',
        user_id:'',
    }),

    methods: {
      fetchdata () {
      let hostname = window.location.hostname
      let realtimeAPI = `http://${hostname}:5000/general/${this.user_id}/${localStorage.code}.${localStorage.exchange}`
      try
      {
        fetch(realtimeAPI,{method: "get",headers: authHeader()})
        .then(response =>{return response.json()})
        .then(data =>{
          if (data.authenticated == false) {
            store.dispatch('auth/logout').then(
              () => {
                alert("Session Expired. Please login again.")
                this.$router.push('/login');
              },
              error => {
                console.log(error);
              }
            )
          } else {
            this.info=data
            this.loaded=true
          } 

        })
        .catch(e => {
        console.log("Response status: "+e)
        })
      }
      catch(error)
      {
        this.assignNull()
        console.log(error)
      }
      },
    },
    mounted(){
      this.user_id = getId()
      this.stock = { code: localStorage.code, exchange: localStorage.exchange}
      this.fetchdata ()
    }
}
</script>