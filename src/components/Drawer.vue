<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      expand-on-hover
    >
      <v-list dense>
        <v-list-item link v-for="item in drawerItems" :key="item.title" :to="item.link">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
        app
        color=primary
        dark
        dense
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>{{ this.$route.name }}</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
  export default {
    name: 'Drawer',
    data: () => ({
      drawer: null,
      drawerItems: [
      {title: "Dashboard", icon: "dashboard", link: '/'},
      {title: "Markets", icon: "show_chart", link: '/markets'},
      {title: "Watchlist", icon: "list", link: '/watchlist'},
      {title: "Portfolio", icon: "recent_actors", link: '/portfolio'},
      {title: "News Feed", icon: "dynamic_feed", link: '/newsfeed'}
      ] 
    }),
    props: {
      source: String,
    },
  } 
</script>