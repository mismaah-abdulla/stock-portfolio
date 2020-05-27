<template>
  <div id='app'>
    <!--Show Profile Page-->
    <div v-if="(editpp == false && editcp == false)">
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

        <v-spacer></v-spacer>
        <v-btn icon @click="currentPage = 'watchlist'">
          <v-icon v-if="currentPage == 'watchlist'" color="#00E676">mdi-eye-plus</v-icon>
          <v-icon v-else-if="currentPage !== 'watchlist'">mdi-eye-plus</v-icon>
        </v-btn>
        <v-btn icon @click="getMentionsLoaded()">
          <v-icon v-if="createPostDialog == true" color="#00E676">mdi-pencil-box-multiple</v-icon>
          <v-icon v-else-if="createPostDialog == false">mdi-pencil-box-multiple</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-app-bar>
      <!--//-->
      <!--Header Bar-->
      <v-app-bar color="grey lighten-4" class="mb-n1" dense height="30" flat>
        <v-col cols="3" @click="currentPage = 'profile'" class="mr-n3 ml-n5">
          <v-btn v-if="currentPage == 'profile'" x-small depressed color="lime lighten-2">Profile</v-btn>
          <v-btn v-else x-small outlined color="lime darken-2">Profile</v-btn>
        </v-col>
        <v-col cols="3" @click="goToPost()" class="mr-n5">
          <v-btn v-if="currentPage == 'posts'" x-small depressed color="lime lighten-2">Posts</v-btn>
          <v-btn v-else x-small outlined color="lime darken-2">Posts</v-btn>
        </v-col>
        <v-col cols="4" @click="currentPage = 'portfolio'">
          <v-btn v-if="currentPage == 'portfolio'" x-small depressed color="lime lighten-2">Portfolio</v-btn>
          <v-btn v-else x-small outlined color="lime darken-2">Portfolio</v-btn>
        </v-col>        
      </v-app-bar>
      <!--//-->
      <!--Cover Picture-->
      <v-row dense class="mb-n12">
        <v-col cols="12">
          <img v-if="cover_pic == ''" src="@/assets/blueBackground.jpg" height="110" width="100%" @click="editCoverPic()">
          <img v-else :src="coverPicture" alt="" height="110" width="100%" @click="editCoverPic()">
        </v-col>
      </v-row>
      <!--//-->

      <v-row class="mt-n12">
        <!--Profile Picture-->
        <v-col cols="4" class="mt-n10 ml-4">
          <v-avatar size="120" color="white" outlined>
            <v-icon v-if="profile_pic == ''" size="50" @click="editProfilePic()">mdi-face</v-icon>
            <img v-else :src="profilePicture" @click="editProfilePic()">
          </v-avatar>    
        </v-col>
        <!--//-->
        <!--Display Name & Country-->
        <v-col cols="6" class="mt-7">
          <div v-if="displayName == ''" contenteditable @blur="onEditName" spellcheck="false" class="body-2 font-weight-bold black--text">Display Name</div>
          <div v-else contenteditable @blur="onEditName" spellcheck="false" class="body-2 font-weight-bold black--text">{{displayName}}</div>
          <select id="countryDropdown" class="countries caption font-italic font-weight-regular black--text" @change="onEditCountry">
            <option v-if="country !== ''">{{country}}</option> 
            <option v-else value="">Country</option>
            <option value="United States">United States</option>
            <option value="Singapore">Singapore</option>
            <option value="Hong Kong">Hong Kong</option>
          </select>
        </v-col>
        <!--//-->
      </v-row>
      <!--Dashboard-->
      <v-row>
        <v-col cols="12" class="ml-1 mt-n4">
          <div class="subtitle-2 text-left font-weight-bold black--text grey lighten-4">Dashboard</div>
        </v-col>
        <v-col cols="12" class="ml-1 mt-n6 mb-n4">
          <div class="text-left font-italic caption">Private to you</div>
        </v-col>
      </v-row> 
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-card outlined color="grey lighten-2" max-height="50">
            <v-card-text class="body-2">
              <div class="text-center mt-n2 font-weight-bold black--text">76</div>
              <div class="text-center mx-n3">Profile Views</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4" class="ml-n3 mr-n3">
          <v-card outlined color="grey lighten-2" max-height="50">
            <v-card-text class="body-2">
              <div class="text-center mt-n2 font-weight-bold black--text">150</div>
              <div class="text-center mx-n2">Post Views</div>
            </v-card-text>
          </v-card>          
        </v-col>
        <v-col cols="4">
          <v-card outlined color="grey lighten-2" max-height="50">
            <v-card-text class="body-2">
              <div class="text-center mt-n2 font-weight-bold black--text">25</div>
              <div class="text-center mx-n2">Searches</div>
            </v-card-text>
          </v-card>          
        </v-col>
      </v-row>
      <!--//-->
      <!--About-->
      <v-row class="mb-n4">
        <v-col cols="12" class="ml-1 mt-n3">
          <div class="subtitle-2 text-left font-weight-bold black--text grey lighten-4">About</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="ml-3">
          <div v-if="about == ''" style="max-width:320px" contenteditable @blur="onEditAbout" spellcheck="false" class="text-left font-weight-light black--text">Write something about yourself!</div>
          <div v-else style="max-width:320px" contenteditable @blur="onEditAbout" spellcheck="false" class="text-left font-weight-light black--text">{{about}}</div>
        </v-col>
      </v-row>
      <!--//-->
      <!--Activities-->
      <v-row class="mb-n4">
        <v-col cols="12" class="ml-1 mt-n3">
          <div class="subtitle-2 text-left font-weight-bold black--text grey lighten-4">Activities</div>
        </v-col>
      </v-row>      
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
      <!--//-->
    </div>
    <!--Edit Profile Picture -->
    <div v-else-if="(editpp == true && editcp == false)">
      <v-row justify="center" class="mt-5 mb-3">
        <div class="body-2 font-weight-bold black--text">Profile Picture</div>
      </v-row>

      <v-row justify="center" class="mb-5">
        <croppa
          id="cropProfilePic"
          v-model="cropProfilePic" 
          canvas-color="transparent"
          :image-border-radius=320
          :placeholder="'Upload Profile Picture'"
          :placeholder-font-size="12"
          :placeholder-color="'black'"
          :accept="'image/*'"
          :quality="3"
          :zoom-speed="3"
          :disabled="false"
          :disable-drag-and-drop="true"
          :disable-click-to-choose="false"
          :disable-drag-to-move="false"
          :disable-scroll-to-zoom="false"   
          :disable-rotation="true"
          :prevent-white-space="true"
          :show-remove-button="false"
          :auto-sizing="true"
        >
        </croppa>
      </v-row>
      
      <v-row justify="center" class="mt-2 mb-2">
        <v-btn x-small @click="removeImage(1)">Remove</v-btn>        
      </v-row>
      
      <v-row class="mt-4">
        <v-spacer></v-spacer>
          <v-btn class="mt-3"
            text 
            color="teal lighten-1" 
            @click="editProfilePic()"
          >Cancel
          </v-btn> 
          <v-btn class="mt-3 mr-3"
            text 
            color="teal lighten-1" 
            @click="submitImages(1)"
          >Submit
          </v-btn> 
      </v-row>
    </div>
    <!--//-->
    <!--Edit Cover Picture -->      
    <div v-else-if="(editpp == false && editcp == true)">
      <v-row justify="center" class="mt-5 mb-3">
        <div class="body-2 font-weight-bold black--text">Cover Picture</div>
      </v-row>

      <v-row justify="center" class="mb-5">
        <croppa 
          id="cropCoverPic"
          v-model="cropCoverPic"
          canvas-color="transparent"
          :placeholder="'Upload Cover Picture'"
          :placeholder-font-size="12"
          :placeholder-color="'black'"
          :accept="'image/*'"
          :quality="3"
          :zoom-speed="3"
          :disabled="false"
          :disable-drag-and-drop="true"
          :disable-click-to-choose="false"
          :disable-drag-to-move="false"
          :disable-scroll-to-zoom="false"   
          :disable-rotation="true"
          :prevent-white-space="true"
          :show-remove-button="false"
          :auto-sizing="true">
        </croppa>
      </v-row>

      <v-row justify="center" class="mt-2 mb-2">
        <v-btn x-small @click="removeImage(2)">Remove</v-btn>        
      </v-row>

      <v-row class="mt-4">
        <v-spacer></v-spacer>
          <v-btn class="mt-3"
            text 
            color="teal lighten-1" 
            @click="editCoverPic()"
          >Cancel
          </v-btn> 
          <v-btn class="mt-3 mr-3"
            text 
            color="teal lighten-1" 
            @click="submitImages(2)"
          >Submit
          </v-btn> 
      </v-row>
    </div>
    <!--//-->

    <!--Create Post-->
    <v-row justify="center">
      <v-dialog v-model="createPostDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="lime" flat>
            <v-btn icon dark @click="closePostDialog()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Create Post</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="createPost()">Post</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="pl-3">
            <v-container>
              <v-row>
                <v-col cols="2">
                  <v-avatar size="35" tile color="white" @click.stop="drawer()" class="ml-n2 mr-2">
                    <v-icon v-if="profile_pic == ''" size="30">mdi-face</v-icon>
                    <img v-else :src="profilePicture">
                  </v-avatar>  
                </v-col>
                <v-col class="ml-n4" cols="6">
                  <div class="caption font-weight-bold black--text">{{displayName}}</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="ml-n3">
                  <at at="$" :members="securities" name-key="name" ref="at" :filter-match="filterMatch">
                    <template slot="item" slot-scope="s">
                      <span>
                        <span class="tag">
                          <span class="mentionText1" v-text="s.item.name"></span>
                          <span v-text="s.item.id" style="display:none"></span>
                        </span>
                      </span>
                    </template>
                    <at at="@" :members="users" name-key="name" ref="at" :filter-match="filterMatch">
                      <template slot="item" slot-scope="s">
                        <span>
                          <span class="tag">
                            <v-avatar v-if="s.item.avatar !== ''" size="25">
                              <img :src="s.item.avatar">
                            </v-avatar>
                            <v-avatar v-else size="25">
                              <v-icon>mdi-face</v-icon>
                            </v-avatar>
                            <span :data-user-id="s.item.id" class="mentionText1" v-text="s.item.name"></span>
                            <!--<span v-text="s.item.id" style="display:none"></span>-->
                          </span>
                        </span>
                      </template>                   
                      <DxHtmlEditor 
                        v-model="valueContent"
                        value-type="html"
                        class="htmleditor"
                      >
                        <DxMediaResizing :enabled="true"/>
                        <DxToolbar :multiline="isMultiline">
                          <!--
                          <DxItem format-name="undo"/>
                          <DxItem format-name="redo"/>
                          <DxItem format-name="separator"/>
                          <DxItem
                            :format-values="sizeValues"
                            format-name="size"
                          />
                          <DxItem
                            :format-values="fontValues"
                            format-name="font"
                          />
                          <DxItem format-name="separator"/>
                          -->
                          <DxItem format-name="bold"/>
                          <DxItem format-name="italic"/>
                          <DxItem format-name="strike"/>
                          <DxItem format-name="underline"/>
                          <!--
                          <DxItem format-name="separator"/>
                          <DxItem format-name="alignLeft"/>
                          <DxItem format-name="alignCenter"/>
                          <DxItem format-name="alignRight"/>
                          <DxItem format-name="alignJustify"/>
                          <DxItem format-name="separator"/>
                          -->
                          <DxItem format-name="orderedList"/>
                          <DxItem format-name="bulletList"/>
                          <!--
                          <DxItem format-name="separator"/>
                          <DxItem
                            :format-values="headerValues"
                            format-name="header"
                          />
                          <DxItem format-name="separator"/>
                          <DxItem format-name="color"/>
                          <DxItem format-name="background"/>
                          <DxItem format-name="separator"/>
                          <DxItem format-name="link"/>
                          <DxItem format-name="image"/>
                          <DxItem format-name="separator"/>
                          <DxItem format-name="clear"/>
                          <DxItem format-name="codeBlock"/>
                          <DxItem format-name="blockquote"/>
                          -->
                        </DxToolbar>
                        <div 
                          @focus="handleFocus" 
                          @blur="handleBlur" 
                          contenteditable 
                          data-text="What's on your mind?" 
                          spellcheck="false"
                          class="title text-left font-weight-light black--text"
                        >
                        </div> 
                      </DxHtmlEditor>
                    </at>
                  </at>
                  <!--
                  <div class="value-content">{{ valueContent }}</div>
                  -->
                  <!--
                  <at at="$" :members="securities" ref="at" :filter-match="filterMatch">
                    <at at="@" :members="users" name-key="name" ref="at" :filter-match="filterMatch">
                      <template slot="item" slot-scope="s">
                        <span>
                          <span class="tag">
                            <v-avatar v-if="s.item.avatar !== ''" size="25">
                              <img :src="s.item.avatar">
                            </v-avatar>
                            <v-avatar v-else size="25">
                              <v-icon>mdi-face</v-icon>
                            </v-avatar>
                            <span v-text="s.item.name"></span>
                            <span v-text="s.item.user_id" style="display:none"></span>
                          </span>
                        </span>
                      </template>
                      <div 
                        id="post" 
                        @focus="handleFocus" 
                        @blur="handleBlur" 
                        contenteditable 
                        data-text="What's on your mind?" 
                        spellcheck="false" 
                        class="post title text-left font-weight-light black--text"
                      >
                      </div>                    
                    </at>
                  </at>
                  -->
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <!--//-->
  </div>
</template>

<script>
import { getId } from '../utils';
import authHeader from '../services/auth-header';
import store from '../store';
import At from 'vue-at';
import {
  DxHtmlEditor,
  DxToolbar,
  DxMediaResizing,
  DxItem
} from 'devextreme-vue/html-editor';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

export default {
  name: "Profile",
  data() {
    return {
      displayName: '',
      about: '',
      country: '',
      countries: ['', 'United States', 'Singapore', 'Hong Kong'],
      currentPage: 'profile',
      profile_pic: null,
      cover_pic: null,
      user_id: '',
      cropProfilePic: {},
      cropCoverPic: {},
      editpp: false,
      editcp: false,
      createPostDialog: false,
      users: [],
      securities: [],
      blurTimer: null,
      hideOnBlur: true,
      usersPopulated: false,
      securitiesPopulated: false,
      filterMatch : (name, chunk) => name.toLowerCase().indexOf(chunk.toLowerCase()) === 0,
      //sizeValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
      //fontValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
      //headerValues: [false, 1, 2, 3, 4, 5],
      isMultiline: false,
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
    coverPicture () {
      return `data:image/png;base64, ${this.cover_pic}`
    },
  },
  components: {
    At,
    DxHtmlEditor,
    DxMediaResizing,
    DxToolbar,
    DxItem,
  },
  methods: {
    createPost() {
      if (this.valueContent == null) {
        alert('Post can\'t be empty');
        return
      }
      var cleanText = this.valueContent.replace(/<\/?[^>]+(>|$)/g, "");
      if (!cleanText.replace(/\s/g,'').length) {
        alert('Post can\'t be empty');
        return
      }
      let formData = new FormData();
      formData.append('content', this.valueContent);
      let hostname = window.location.hostname;
      let API_URL = `http://${hostname}:5000/createpost/${this.user_id}`      
      try {
        fetch(API_URL, {
          method: 'POST',
          body: formData
        })
        .then(response =>{ return response.json();})
        .then(data =>{
          if (data == "successful") {
            alert('Successfully created post.')
            this.valueContent = null;
            this.createPostDialog = false;
          } else {
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
    likePost(postId) {
      let formData = new FormData();
      formData.append('postId', postId);
      let hostname = window.location.hostname
      let API_URL = `http://${hostname}:5000/likepost/${this.user_id}`
      try {
        fetch(API_URL, {
          method: 'POST',
          body: formData
        })
        .then(response =>{ return response.json();})
        .then(data =>{
          if (data == "liked") {
            for (let i=0;i<this.posts.length;i++) {
              if (this.posts[i].postId == postId) {
                this.posts[i].postLiked = true;
                this.posts[i].postTotalLikes = this.posts[i].postTotalLikes + 1;
              }
            }
          }
          else if (data == "unliked") {
            for (let i=0;i<this.posts.length;i++) {
              if (this.posts[i].postId == postId) {               
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
    getMentionsLoaded() {
      if (this.displayName == '') {
        alert('You need to update your display name');
      } 
      else {
        try {
          let hostname = window.location.hostname
          let API_URL = `http://${hostname}:5000/profile/getalluser/${this.user_id}`
          fetch(API_URL)
          .then(response => {return response.json()})
          .then(data => {
            if (this.usersPopulated == false) {
              for (let i=0; i<data.length; i++){
                if(data[i].icon !== '') {
                  let object = {
                    name: data[i].text,
                    avatar: 'data:image/png;base64, ' + data[i].icon,
                    id: data[i].id
                  }
                  this.users.push(object);
                }
                else {
                  let object = {
                    name: data[i].text,
                    avatar: '',
                    id: data[i].id
                  }
                  this.users.push(object);                  
                }
              }
              console.log(this.users);
              this.usersPopulated = true;
              //this.createPostDialog = true;
            }
              //this.createPostDialog = true;
          })
          .catch(e => {
            console.log(e)
          })
        }
        catch(error){
          console.log(error);
        }
        try {
          this.createPostDialog = true;
          let hostname = window.location.hostname
          let API_URL = `http://${hostname}:5000/profile/getallsec/${this.user_id}`
          fetch(API_URL)
          .then(response => {return response.json()})
          .then(data => {
            if (this.securitiesPopulated == false) {
                for (let i=0; i<data.length; i++) {
                  let object = {
                    name: data[i].text,
                    id: data[i].id
                  }
                  this.securities.push(object);
                }
              console.log(this.securities);
              this.securitiesPopulated = true;
            }
          })
          .catch(e => {
            console.log(e)
          })
        }
        catch(error){
          console.log(error);
        }
      }
    },
    handleFocus() {
      if (this.hideOnBlur) {
        clearTimeout(this.blurTimer);
      }
    },
    handleBlur() {
      if (this.hideOnBlur) {
        this.blurTimer = setTimeout(()=>{
          this.$refs.at.closePanel()
        }, 500)
      }
    },   
    onEditName(evt) {
      var src = evt.target.innerText;
      if (src == '') {
        alert('Display Name cannot leave empty');
        evt.target.innerText = 'Display Name';
      } 
      else if (/\s/.test(src)) {
        alert('Display Name cannot contain spaces');
        evt.target.innerText = this.displayName;
        return
      }
      else {
        var cleanText = src.replace(/<\/?[^>]+(>|$)/g, "");
        if (cleanText.length >= 20) {
          alert('Display Name cannot be longer than 20 characters')
          evt.target.innerText = this.displayName;
          return
        }
        this.displayName = src;
        let formData = new FormData();
        formData.append('data', 1);
        formData.append('display_name', this.displayName);
        let hostname = window.location.hostname;
        let API_URL = `http://${hostname}:5000/profile/edit/${this.user_id}`      
        try {
          fetch(API_URL, {
            method: 'POST',
            body: formData
          })
          .then(response =>{ return response.json();})
          .then(data =>{
            if (data == "successful") {
              this.posts = []
              this.loadPost();
              console.log(data);
            } else {
              console.log(data);
            }
          })
          .catch(e => {
            console.log(e)
          })
        }catch(error){
          console.log(error);
        }
      }
    },
    onEditAbout(evt) {
      var src = evt.target.innerText;
      if (src == '') {
        evt.target.innerText = 'Write Something About Yourself!';
      }
      else {
        this.about = src;
        let formData = new FormData();
        formData.append('data', 2);
        formData.append('about', this.about);
        let hostname = window.location.hostname;
        let API_URL = `http://${hostname}:5000/profile/edit/${this.user_id}`      
        try {
          fetch(API_URL, {
            method: 'POST',
            body: formData
          })
          .then(response =>{ return response.json();})
          .then(data =>{
            if (data == "successful") {
              console.log(data);
            } else {
              console.log(data);
            }
          })
          .catch(e => {
            console.log(e)
          })
        }catch(error){
          console.log(error);
        }
      }
    },
    onEditCountry() {
      var sel = document.getElementById("countryDropdown");
      var text = sel.options[sel.selectedIndex].text;
      if (text == 'Country') {
        this.country = "";
      }
      else {
        this.country = text;
      }
      if (this.country !== "") {
        let formData = new FormData();
        formData.append('data', 3);
        formData.append('countryname', this.country);
        let hostname = window.location.hostname;
        let API_URL = `http://${hostname}:5000/profile/edit/${this.user_id}`      
        try {
          fetch(API_URL, {
            method: 'POST',
            body: formData
          })
          .then(response =>{ return response.json();})
          .then(data =>{
            if (data == "successful") {
              console.log(data);
            } else {
              console.log(data);
            }
          })
          .catch(e => {
            console.log(e)
          })
        }catch(error){
          console.log(error);
        }
      }
    },
    submitImages(pic) {
      if (pic == 1) { //Profile Pic
        console.log(pic)
        this.cropProfilePic.generateBlob(
          blob => {
            let formData = new FormData();
            if (blob !== null) {
              formData.append('profile', blob, 'profile_pic.jpg');
            }
            formData.append('pic', 1);
            let hostname = window.location.hostname
            let API_URL = `http://${hostname}:5000/profile/submitimages/${this.user_id}`
            try {
              fetch(API_URL, {
                method: 'POST',
                body: formData
              })
              .then(response =>{ return response.json();})
              .then(data =>{
                if (data == "successful") {
                  this.editpp = false;
                  window.location.reload();
                } 
                else {
                  alert("Please upload an image")
                  console.log(data);
                }
              })
              .catch(e => {
                console.log(e)
              })
            }
            catch(error) {
              console.log(error);
            }
          },
          'image/*',
          0.8
        );         
      }
      else if (pic == 2) { //Cover Pic
        console.log(pic)
        this.cropCoverPic.generateBlob(
          blob => {
            let formData = new FormData();
            if (blob !== null) {
              formData.append('cover', blob, 'cover_pic.jpg');
            }
            formData.append('pic', 2);
            let hostname = window.location.hostname
            let API_URL = `http://${hostname}:5000/profile/submitimages/${this.user_id}`
            try {
              fetch(API_URL, {
                method: 'POST',
                body: formData
              })
              .then(response =>{ return response.json();})
              .then(data =>{
                if (data == "successful") {
                  this.editcp = false;
                  window.location.reload();
                } 
                else {
                  alert("Please upload an image")
                  console.log(data);
                }
              })
              .catch(e => {
                console.log(e)
              })
            }
            catch(error) {
              console.log(error);
            }
          },
          'image/*',
          0.8
        );                   
      }
    },    
    loadData() { //displayName, country, about
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
            this.about = data.About;
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
            this.cover_pic = data.base64_cover
          } else {
            this.profile_pic = '';
            this.cover_pic = '';
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
    loadPost() {
      let hostname = window.location.hostname
      let API_URL = `http://${hostname}:5000/getownpost/${this.user_id}`
      try {
        fetch(API_URL,
        {
          method: "POST",
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
    drawer(){
      this.$emit('drawer')
    },     
    goToPost(){
      this.$router.push({ name: 'Post'});
    },
    goToWatchlist() {
      this.$router.push('/watchlist');
    },
    editProfilePic() {
      this.editpp = !this.editpp;
    },
    editCoverPic() {
      this.editcp = !this.editcp;
    },
    closePostDialog() {
      this.valueContent = null;
      this.createPostDialog = false;
    },      
    removeImage(image) {
      if (image == 1) {
        this.cropProfilePic.remove();
      } else if (image == 2) {
        this.cropCoverPic.remove();
      }
    },
  }
  //push again
}
</script>

<style>
#cropProfilePic {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #DCDCDC;  
}
#cropCoverPic {
  width: 100%;
  height: 110px;
  background-color: #DCDCDC;  
}
.countries {
  color: black;
  font-size: 12px;
}
.countries option {
  color: black;
  padding: 4px 8px;
  font-size: 13px;
  display: block;
}
.post {
  min-height: 300px;
  width:108%;
  outline: 1px solid;
  outline-color: gainsboro;
}
#app .atwho-li span {
  font-size: 12px;
}
[contentEditable=true]:empty:not(:focus):before{
    content:attr(data-text)
}
.htmleditor {
  width: 100%;
  height: auto;
}
.mentionText1 {
  color: cornflowerblue;
}
.container {
  line-height: 15px;
  height: auto;
  overflow: hidden;
  position: relative;
  font-size: 14px;
}
</style>