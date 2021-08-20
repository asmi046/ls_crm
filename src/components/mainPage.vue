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

      <v-content class="pa-3">
          <v-sheet width="100%"  min-height="30">

          </v-sheet >

          <v-sheet width="100%">
            <v-calendar locale="ru" :type = "type" :events = "events" @change="getEvents">

            </v-calendar>
          </v-sheet>
      </v-content>
  </div>
</template>

<script>
export default {
  data() {
    return {  
      showMenu:false,
      type:"month",
      events:[]
    }
  },

      methods: {
        getEvents () {
          console.log("ddd");
          let ev =[];
          ev.push({
          name:"Событие #1",
          start:new Date(),
          
          });

          this.events = ev;
          console.log(this.events);
        }
      }
}
</script>

<style>

</style>