<template>
  <v-app >
    <v-main>
      <v-app-bar v-show="SHOW_PANEL"> 
        <v-app-bar-nav-icon @click="showMenu = !showMenu"></v-app-bar-nav-icon>
        <v-toolbar-title>Панель инструментов менеджера</v-toolbar-title>
      
        <v-spacer></v-spacer>
        
        <v-btn icon @click.prevent="appExit">
          <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
      
      </v-app-bar>
      


      <v-navigation-drawer
        v-model="showMenu"
        absolute
        temporary
      >
        <v-list
          nav
          dense
        >
          <v-list-item-group
            @change = "showMenu = false"
            v-model="selectedItem"
            active-class="deep-purple--text text--accent-4"
          >
            <v-list-item v-for="(item, i) in USER_MENU" :key="i" :to = "item.to">
              <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{item.text}}</v-list-item-title>
            </v-list-item>

          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex'
import allLibs from './lib/libs'

export default {
  name: 'App',
  
  computed: {
    ...mapGetters (["REST_API_PREFIX", "SHOW_PANEL", "USER_STATUS", "USER_MENU"])
  },

  data: () => ({
    showMenu:false,
    selectedItem:0,

  }),

  methods: {
    appExit() {
      allLibs.reloginUser();
    }
  },
  mounted: function() {


  }
};
</script>

<style>

  @media (min-width: 1264px){
    .container {
        max-width: 96%;
    }
  }

  @media (min-width: 960px){
    .container {
        max-width: 96%;
    }
  }
</style>
