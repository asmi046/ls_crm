<template>
  <v-container class = "pd-2" >
    <h1>Добавить склад</h1>
       <v-form ref = "addingSkaladForm">
          <v-row> 
              <v-col>
                    <v-text-field
                    :rules="requiredRules"
                    v-model="name"
                    label="Наименование склада"
                    prepend-icon="mdi-form-textbox"
                    ></v-text-field>
              </v-col>
              <v-col>
                    <v-text-field
                    :rules="requiredRules"
                    v-model="adres"
                    label="Адрес склада"
                    prepend-icon="mdi-home-city-outline"
                    ></v-text-field>
              </v-col>
          </v-row> 
          <v-row>
              <v-col>
                    <v-text-field  :rules="phoneRules" v-model="phone" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone" ></v-text-field>
              </v-col>
              <v-col>
                    <v-text-field
                    v-model="geo"
                    label="Геопозиция"
                    prepend-icon="mdi-map-marker-outline"
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
                    <v-btn @click="addSkladToBase()" color="success">
                        <v-icon class="mr-2">mdi-plus</v-icon> Добавить склад в справочник
                    </v-btn>  
              </v-col>
          </v-row>

         
       </v-form>
        <v-row>
              <v-col>
                    <v-data-table
                    locale="ru-RU"
                    :headers="headers"
                    :items="allSclads"
                    :items-per-page="30"
                    class="sclad_table"
                    :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-arrow-collapse-left',
                    lastIcon: 'mdi-arrow-collapse-right',
                    prevIcon: 'mdi-minus',
                    nextIcon: 'mdi-plus',
                    itemsPerPageText:'Записей на странице',
                    pageText: '{0}-{1} из {2}'
                    }"
                    >
                        <template v-slot:[`item.name`]="{ item }">
                            <v-text-field
                                class="fieldInTable"
                                v-model="item.name"
                                :rules="requiredRules"
                                @change="updateSklad(item)"
                            ></v-text-field>
                        </template>

                        <template v-slot:[`item.adres`]="{ item }">
                            <v-text-field
                                class="fieldInTable"
                                v-model="item.adres"
                                :rules="requiredRules"
                                @change="updateSklad(item)"
                            ></v-text-field>
                        </template>

                        <template v-slot:[`item.phone`]="{ item }">
                           <v-text-field @change="updateSklad(item)"  :rules="phoneRules" v-model="item.phone" v-mask="'+# (###) ###-##-##'" ></v-text-field>
                        </template>

                        <template v-slot:[`item.geo`]="{ item }">
                            <v-text-field
                                class="fieldInTable"
                                v-model="item.geo"
                                :rules="requiredRules"
                                @change="updateSklad(item)"
                            ></v-text-field>
                        </template>

                        <template v-slot:[`item.control`]="{ item }">
                            <v-icon title = "Удалить склад" class = "mr-2" @click="deleteSklad(item)" >mdi-trash-can-outline</v-icon>
                        </template>

                    </v-data-table>
              </v-col>
          </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex'

export default {
    data() {
        return{
            name:"",
            adres:"",
            phone:"",
            geo:"",

            alertType: "error",
            showAlert: false,
            message: "",

            requiredRules:[
                value => value !== "" || 'Должно быть заполнено.'
            ],
            
            phoneRules:[
                value => (value && value.length >= 18) || 'Телефон некорректен',
            ],

            allSclads:[],
            headers: [
                {
                    text: 'Наименование склада',
                    value: 'name',
                },
                { text: 'Адрес склада', value: 'adres' },
                { text: 'Телефон', value: 'phone' },
                { text: 'Геопозиция', value: 'geo' },
                { text: '', value: 'control' }
            ],
        }
    },

    computed: {
            ...mapGetters (["REST_API_PREFIX"]),
    },

    methods:{

        deleteSklad(item) {
            axios.delete(this.REST_API_PREFIX + 'del_sklad',
            {
                params: {
                    orderid: item.id,
                }
            })
            .then( (resp) => {
              console.log(resp);
              this.$router.go(this.$router.currentRoute)
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
                console.log(rezText);

            });
        },
        updateSklad(item) {
            
            if (
                (item.name == "")||
                (item.adres == "")||
                (item.phone == "")
            ) return;

            var formData = new FormData();
            formData.append("name", item.name);
            formData.append("adres", item.adres);
            formData.append("phone", item.phone);
            formData.append("geo", item.geo);
            formData.append("id", item.id);


            axios.post(this.REST_API_PREFIX + 'sklad_update', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then( (resp) => {
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
                console.log(rezText);
            });
        },

        addSkladToBase() {
            if (this.$refs.addingSkaladForm.validate()) {
                var formData = new FormData();
                formData.append("name", this.name);
                formData.append("adres", this.adres);
                formData.append("phone", this.phone);
                formData.append("geo", this.geo);

                this.showAlert = false;

                axios.post(this.REST_API_PREFIX + 'sklad_to_base', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then( (resp) => {
                    this.message = "Данные добавленны"
                    this.alertType = "success";
                    this.showAlert = true;
                    
                    this.$refs.addingSkaladForm.reset()
                    console.log(resp)
                    
      

                    this.allSclads.push(resp.data.fild)
                    console.log(this.allSclads)
                    // console.log(element)
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
    },

    created:function (){
         axios.get(this.REST_API_PREFIX + 'get_all_sclads',
                {
                    params: {
                        querystr: "",
                    }
                })
                .then( (resp) => {
                    this.allSclads = resp.data.slice()
                    console.log(this.allSclads);
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
                    
                    this.message = rezText
                    this.showAlert = "error"
                    this.showAlert = true
            });
    }
}
</script>

<style>
.fieldInTable {
    width:100%;
}
</style>