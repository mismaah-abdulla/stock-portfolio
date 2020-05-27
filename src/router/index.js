import Vue from 'vue'
import VueRouter from 'vue-router'
import Markets from '../views/Markets'
import Watchlist from '../views/Watchlist'
import NewsFeed from '../views/News'
//import Portfolio from '../views/Portfolio'
import Register from '../views/Register'
import Login from '../views/Login'
import Profile from '../views/Profile'
import Post from '../views/Post'
import store from '../store'
import { isValidJwt } from '../utils/index.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/markets',
    name: 'Markets',
    component: Markets,
  },
  {
    path: '/watchlist',
    name: 'Watchlist',
    component: Watchlist,
  },
  {
    path: '/',
    component: Login
  },
  {
    path: '/newsfeed',
    name: 'News Feed',
    component: NewsFeed
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/post',
    name: 'Post',
    component: Post
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const result = isValidJwt();
  //console.log('result: '+result);
  if (authRequired && (result == false)) {
    store.dispatch('auth/logout').then(
      () => {
        alert("Session Expired. Please login again.")
        next('/login')
      },
      error => {
        console.log(error);
      }
    )
  } else {
    //console.log('token available');
    next();
  }
});

export default router
