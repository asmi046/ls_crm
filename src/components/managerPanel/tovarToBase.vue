<template>
    <v-container class = "pd-2" >
        <h1>Добавить товар </h1>      
          <v-form ref = "addingForm">
            <v-row>
              <v-col>
                  <v-file-input
                    :rules="rulesFile"
                    accept="image/jpeg"
                    placeholder="Добавьте изображение товара"
                    prepend-icon="mdi-camera"
                    label="Изображение"
                    v-model="file"
                  ></v-file-input>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  :rules="requiredRules"
                  v-model="name"
                  label="Наименование"
                  prepend-icon="mdi-form-textbox"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  :rules="requiredRules"
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
                <v-col cols="12">
                    <v-alert
                        border="right"
                        colored-border
                        :type = "alertType"
                        elevation="2"
                        v-show="showAlert"
                    >{{message}}</v-alert>
                </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn @click="addTovarToBase()" color="success">
                    <v-icon class="mr-2">mdi-plus</v-icon> Добавить товар в справочник
                </v-btn>  
              </v-col>
            </v-row>

          </v-form>
        </v-container>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex'
export default {
    data() {
        return{
            file:null,
            name:"",
            sku:"",
            search:"",

            alertType: "error",
            showAlert: false,
            message: "",

            rulesFile: [
              value => value ||'Выберите файл',
            ],

            requiredRules:[
                value => value !== "" || 'Должно быть заполнено.'
            ],
        }
    },
    
    computed: {
            ...mapGetters (["REST_API_PREFIX"]),
    },

    methods:{
      addTovarToBase() {
        if (this.$refs.addingForm.validate()) {
          var formData = new FormData();
          formData.append("image", this.file);
          formData.append("name", this.name);
          formData.append("sku", this.sku);
          formData.append("serch", this.search);

          this.showAlert = false;

          axios.post(this.REST_API_PREFIX + 'add_tov_to_base', formData,
          {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
          })
          .then( (resp) => {
              this.message = "Данные добавленны"
              this.alertType = "success";
              this.showAlert = true;
              
              this.$refs.addingForm.reset()
              console.log(resp)
          })

          .catch((error) => {
              let rezText = "";
              if (error.response)
              {
                  rezText = error.response.data.message;
              } else 
              if (error.request) {
                  rezText = error.message;
              } else {
                  rezText = error.message;
              }
              
              console.log(error.config);
              
              this.message = rezText
              this.showAlert = "error"
              this.showAlert = true
          });
        }
      }
    }
}
</script>

<style>

</style>