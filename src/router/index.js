import Vue from 'vue'
import VueRouter from 'vue-router'
import Markets from '../views/Markets'
import Watchlist from '../views/Watchlist'
import NewsFeed from '../views/News'
import Portfolio from '../views/Portfolio'
// import Login from '../views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/markets/:code.:exchange',
    name: 'Markets',
    component: Markets,
    props: true
  },
  {
    path: '/watchlist',
    name: 'Watchlist',
    component: Watchlist
  },
  {
    path: '/',
    name: 'Portfolio',
    component: Portfolio
  },
  {
    path: '/newsfeed',
    name: 'News Feed',
    component: NewsFeed
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// var isAuthenticated

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//   else next()
// })

export default router
