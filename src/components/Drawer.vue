<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      expand-on-hover
    >
      <v-list dense>
        <v-list-item link v-for="item in drawerItems" :key="item.title">
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
        <v-toolbar-title>Markets</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
  export default {
    name: 'Drawer',
    data: () => ({
      drawer: null,
      drawerItems: [
      {title: "Markets", icon: "show_chart"},
      {title: "Watchlist", icon: "list"},
      {title: "Portfolio", icon: "recent_actors"},
      {title: "News Feed", icon: "dynamic_feed"}
      ] 
    }),
    props: {
      source: String,
    },
  } 
</script>