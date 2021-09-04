<template>
  <v-app >
    <v-main>
      <v-app-bar> 
        <v-app-bar-nav-icon @click="showMenu = !showMenu"></v-app-bar-nav-icon>
        <v-toolbar-title>Панель инструментов менеджера</v-toolbar-title>
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
            <v-list-item v-for="(item, i) in itemsMeny" :key="i" :to = "item.to">
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

export default {
  name: 'App',

  data: () => ({
    showMenu:false,
    selectedItem:0,
    itemsMeny: [
        {text: 'Главная', icon: 'mdi-home', to: "/"},
        {text: 'Создать заказ', icon: 'mdi-file-document-outline', to: {name:'addzak'}},
        {text: 'Черновики', icon: 'mdi-file-alert-outline', to: {name:'draft'}}
    ],
  }),
};
</script>
