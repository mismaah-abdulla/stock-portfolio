<template> 

<div class=fluid>
  <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="blue"
      ></v-progress-linear>

  <i v-for="article in articles" :key="article.url" >
    <v-card 
    class="pa-3"
   
    max-width="500"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      img :src="article.urlToImage"
    >
    <v-card-title>{{article.title}}</v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0">{{article.author}} - {{article.publishedAt}}</v-card-subtitle>
    
    <v-card-text class="text--primary">
      <div>{{article.description}}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="blue"
        text
        v-bind:href="article.url"
      >
        Read More
      </v-btn>

    </v-card-actions>
  </v-card>            
  </i>
</div>
</template>

<script>
import axios from "axios"
export default {

 data () {
    return {
      name: 'News Feed', loading:false,
      articles:[]
    }
  },
  methods:{
    

  },
  mounted(){
  this.loading=true,
  axios.get('https://newsapi.org/v2/everything?q=Finance&sortBy=publishedAt&apiKey=4a455ab1a5dd4d35906efe718446dfe8')
  .then((response) => {
  this.loading=false
  this.articles = response.data.articles;
  })
  }
}
</script>
