<template>
  <div id="app">
    <!--Top Bar-->
    <v-app-bar color="white" flat dense>
      <v-avatar size="35" tile color="white" @click.stop="drawer()" class="ml-n2 mr-2">
        <v-icon v-if="profile_pic == ''" size="30">mdi-face</v-icon>
        <img v-else :src="profilePicture">
      </v-avatar>          

      <div v-if="(displayName == '' && country == '')">
        <span spellcheck="false" class="body-2 font-weight-bold black--text">Display Name</span><br>
      </div>

      <div v-else-if="(displayName !== '' && country == '')" spellcheck="false" class="caption font-weight-bold black--text">{{displayName}}<br></div>
      <div v-else-if="(displayName == '' && country !== '')" spellcheck="false" class="caption font-weight-bold black--text">Display Name<br>
        <div class="caption font-italic font-weight-regular black--text">
          {{country}}
        </div>
      </div>
      <div v-else spellcheck="false" class="caption font-weight-bold black--text">{{displayName}}<br>
        <div class="caption font-italic font-weight-regular black--text">
          {{country}}
        </div>
      </div>        
    </v-app-bar>
    <!--//Top Bar-->
    <!--Header Bar-->
    <v-app-bar color="grey lighten-4" class="mb-n1" dense height="30" flat>
      <v-col cols="3" @click="goToProfile()" class="mr-n3 ml-n5">
        <v-btn v-if="currentPage == 'profile'" x-small depressed color="lime lighten-2">Profile</v-btn>
        <v-btn v-else x-small outlined color="lime darken-2">Profile</v-btn>
      </v-col>
      <v-col cols="3" @click="currentPage = 'posts'" class="mr-n5">
        <v-btn v-if="currentPage == 'posts'" x-small depressed color="lime lighten-2">Posts</v-btn>
        <v-btn v-else x-small outlined color="lime darken-2">Posts</v-btn>
      </v-col>
      <v-col cols="4" @click="currentPage = 'portfolio'">
        <v-btn v-if="currentPage == 'portfolio'" x-small depressed color="lime lighten-2">Portfolio</v-btn>
        <v-btn v-else x-small outlined color="lime darken-2">Portfolio</v-btn>
      </v-col>        
    </v-app-bar>
    <!--//Header Bar-->
    <!--Posts-->
    <div v-for="post in posts" :key="post.postId">
      <v-card outlined class="mt-1 mb-1" raised>
        <v-app-bar color="white" dense flat>
          <v-avatar size="35" tile color="white" class="ml-n2 mr-2">
            <img :src="post.postProfilePic">
          </v-avatar>          
        <div v-if="(post.postDisplayName !== '' && post.postCountry == '')" spellcheck="false" class="caption font-weight-bold black--text">{{ post.postDisplayName }}<br></div>
        <div v-else spellcheck="false" class="caption font-weight-bold black--text">{{ post.postDisplayName }}<br>
          <div class="caption font-italic font-weight-regular black--text">
            {{ post.postCountry }}
          </div>
        </div>    
        </v-app-bar>

        <div id="container" class="container" v-html="post.postContent"></div>
        <div v-if="post.postLiked==false" class="ml-3 caption font-weight-bold black--text">
          {{ post.postTotalLikes }}       
          <v-icon class="mb-1" size="20">mdi-thumb-up-outline</v-icon>
        </div>
        <div v-else class="ml-3 caption font-weight-bold black--text">
          {{ post.postTotalLikes }}       
          <v-icon class="mb-1" size="20">mdi-thumb-up</v-icon>
        </div>

        <v-container class="grey-lighten-5 pl-0 pr-0 pb-0 mt-n3 mb-n5" style="height:60px">
          <v-row no-gutters>
            <v-col v-for="k in 3" :key="k" bottom>
              <v-btn v-if="(k == 1 && post.postLiked == false)" @click="likePost(post.postId)" tile small bottom block color="grey lighten-4">
                LIKE
              </v-btn>
              <v-btn v-else-if="(k == 1 && post.postLiked == true)" @click="likePost(post.postId)" tile small bottom block color="light-blue lighten-4">
                LIKED
              </v-btn>
              <v-btn v-else-if="k == 2" tile small bottom block color="grey lighten-4">
                COMMENT
              </v-btn>
              <v-btn v-else-if="k == 3" tile small bottom block color="grey lighten-4">
                SHARE
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
    <!--//Posts-->
  </div>
</template>

<script>
import { getId } from '../utils';
import authHeader from '../services/auth-header';
import store from '../store';

export default {
  name: "Post",
  data() {
    return {
      displayName: '',
      country: '',
      currentPage: 'posts',
      profile_pic: null,
      user_id: '',
      valueContent: null,
      posts: [],
    }
  },
  created() {
    if(getId()!=0) {
      this.user_id = getId()
      this.loadData();
      this.loadImage();
      this.loadPost();
    }
    else
    {
      store.dispatch('auth/logout').then(
        () => {
          alert("Session Expired. Please login again.")
          this.$router.push('/login');
        },
        error => {
          console.log(error);
        }
      )
    }
  }, 
  computed: {
    profilePicture () {
      return `data:image/png;base64, ${this.profile_pic}`
    },
  },
  methods: {
    showContent() {
      var element = document.getElementById("container");
      element.classList.toggle("auto-width");
    },
    likePost(postId) {
      let formData = new FormData();
      formData.append('userId', this.user_id);
      formData.append('postId', postId);
      let hostname = window.location.hostname
      let API_URL = `http://${hostname}:5000/likepost`
      try {
        fetch(API_URL, {
          method: 'POST',
          body: formData
        })
        .then(response =>{ return response.json();})
        .then(data =>{
          if (data == "liked") {
            console.log(data)
            console.log(postId)
            for (let i=0;i<this.posts.length;i++) {
              if (this.posts[i].postId == postId) {
                console.log(postId);
                this.posts[i].postLiked = true;
                this.posts[i].postTotalLikes = this.posts[i].postTotalLikes + 1;
              }
            }
          }
          else if (data == "unliked") {
            console.log(data)
            console.log(postId)
            for (let i=0;i<this.posts.length;i++) {
              if (this.posts[i].postId == postId) {
                console.log(postId);                
                this.posts[i].postLiked = false;
                this.posts[i].postTotalLikes = this.posts[i].postTotalLikes - 1;
              }
            }            
          } 
          else {
            console.log(data);
          }
        })
        .catch(e => {
          console.log(e)
        })
      }
      catch(error){
        console.log(error);
      }
    },
    goToProfile() {
      this.$router.push({ name: 'Profile'});
    },
    drawer(){
      this.$emit('drawer')
    },    
    loadPost() {
      let formData = new FormData();
      formData.append('userId', this.user_id);
      let hostname = window.location.hostname
      let API_URL = `http://${hostname}:5000/getpost`
      try {
        fetch(API_URL,
        {
          method: 'POST',
          body: formData
        })
        .then(response => {return response.json()})
        .then(data => {
          for (let i=0;i<data.length;i++) {
            let object = {
              postId: data[i].postId,
              postDisplayName: data[i].displayName,
              postCountry: data[i].country,
              postProfilePic: 'data:image/png;base64, ' + data[i].profilePic,
              postDate: data[i].postDate,
              postContent: data[i].content,
              postLiked: data[i].liked,
              postTotalLikes: data[i].totalLikes
            }
            this.posts.push(object);
          }
          console.log(this.posts);
        })
        .catch(e => {
        console.log("Response status: "+e)
        })        
      }
      catch(error) {
        console.log(error)
      }
    },
    loadData() { //displayName, country
      let hostname = window.location.hostname
      let API_URL = `http://${hostname}:5000/profile/getdata/${this.user_id}`
      try {
        fetch(API_URL, 
        {
          method: 'GET',
          headers: authHeader()
        })
        .then(response => {return response.json()})
        .then(data => {
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
          } 
          else { 
            this.displayName = data.DisplayName;
            this.country = data.Country;
          }
        })
        .catch(e => {
        console.log("Response status: "+e)
        })        
      }
      catch(error) {
        console.log(error)
      }
    },
    loadImage() { //Profile Pic, Cover Pic
      let hostname = window.location.hostname
      let API_URL = `http://${hostname}:5000/profile/show-image/${this.user_id}`
      try {
        fetch(API_URL)
        .then(response => {return response.json()})
        .then(data => {
          if (data !== "no pic") {
            this.profile_pic = data.base64_profile
          } else {
            this.profile_pic = '';
          }
        })
        .catch(e => {
          console.log(e)
        })
      }
      catch(error){
        console.log(error);
      }      
    },
  },
}

</script>

<style>
.container {
  line-height: 15px;
  height: auto;
  overflow: hidden;
  position: relative;
  font-size: 14px;

}
.auto-width {
  height: auto !important;
}
</style>