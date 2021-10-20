<template>
    <v-container class = "pd-2" >
        <h1>Добавить товар </h1>      
          <v-form>
            <v-row>
              <v-col>
                  <v-file-input
                    :rules="rules"
                    accept="image/jpeg"
                    placeholder="Добавьте изображение товара"
                    prepend-icon="mdi-camera"
                    label="Изображение"
                  ></v-file-input>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="name"
                  label="Наименование"
                  prepend-icon="mdi-form-textbox"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="sku"
                  label="Артикул"
                  prepend-icon="mdi-form-textbox"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="search"
                  label="Поисковые запросв"
                  prepend-icon="mdi-form-textbox"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn @click="addTovarToBase()" color="success">
                    <v-icon class="mr-2">mdi-plus</v-icon> Добавить товар в справочник
                </v-btn>  
              </v-col>
            </v-row>

          <v-form>
        </v-container>
</template>

<script>
export default {
    data() {
        return{
            filename:"",
            name:"",
            sku:"",
            search:"" 
        }
    },

    methods:{
      addTovarToBase() {
        
      }
    }
}
</script>

<style>

</style>