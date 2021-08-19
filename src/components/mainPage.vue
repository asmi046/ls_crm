<template>
  <div>
      <v-app-bar> 
        <v-app-bar-nav-icon @click="showMenu = !showMenu"></v-app-bar-nav-icon>
        <v-toolbar-title>Панель инструментов менеджера</v-toolbar-title>
      </v-app-bar>
      
      <v-navigation-drawer
        v-model="showMenu"
        absolute
        temporary
      ></v-navigation-drawer>

      <v-content>
          <h1>Привет</h1>
      </v-content>
  </div>
</template>

<script>
export default {
  data() {
    return {  
      showMenu:false
    }
  }
}
</script>

<style>

</style>