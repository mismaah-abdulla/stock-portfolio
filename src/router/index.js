import Vue from 'vue'
import VueRouter from 'vue-router'
import Markets from '../views/Markets'
import Watchlist from '../views/Watchlist'
import NewsFeed from '../views/News'
import Register from '../views/Register'
import Login from '../views/Login'
import { isValidJwt } from '../utils/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/markets/:exchange/:code',
    name: 'Markets',
    component: Markets,
    props: true
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
  if (authRequired && result == false) {
    //console.log('no token/expired');
    next('/login');
  } else {
    //console.log('token available');
    next();
  }
});

export default router
