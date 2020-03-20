import Vue from 'vue'
import VueRouter from 'vue-router'
import Markets from '../views/Markets'
import Watchlist from '../views/Watchlist'
import NewsFeed from '../views/News'

Vue.use(VueRouter)

const routes = [
  {
    path: '/markets',
    name: 'Markets',
    component: Markets
  },
  {
    path: '/watchlist',
    name: 'Watchlist',
    component: Watchlist
  },
  {
    path: '/',
    name: 'Portfolio',
    component: Dashboard
  },
  {
    path: '/newsfeed',
    name: 'News Feed',
    component: NewsFeed
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
