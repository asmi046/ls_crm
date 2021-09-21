<template>
  <v-container class = "pd-2" >
          
          <v-form>
            <v-row>
              
                <v-col md = "10" cols="12">
                    <v-text-field @input="getTovarInBase" v-model = "serchStr" label="Введите запрос" prepend-inner-icon="mdi-magnify" ></v-text-field>                
                </v-col>
                
                <v-col md = "2" cols="12">
                    <v-btn width = "100%" class = "mt-3" color="success">
                          <v-icon class="mr-2">mdi-minus-circle-outline</v-icon> Сбросить
                    </v-btn>               
                </v-col>
              
            </v-row>
          </v-form>

          <v-row>
            <v-col>
              <v-btn tile :color="(!showCalendar)?'success':'error'"  @click.prevent="showCalendar = !showCalendar">
                <v-icon left>mdi-calendar</v-icon>
                  <span v-text = "(!showCalendar)?'Показать календарь':'Скрыть календарь'">Показать календарь</span>
              </v-btn>              
            </v-col>
          </v-row>
          
          <v-row v-show = "showCalendar">
            <v-col>
                <v-sheet width="100%">
                  <v-calendar locale="ru"  :type = "type" :events = "events" @change="getEvents"></v-calendar>
                </v-sheet>
            </v-col>


          </v-row>

          <v-row>
            <v-col>
                <v-data-table
                locale="ru-RU"
                :headers="headers"
                :items="zakazList"
                :items-per-page="30"
                item-key="name"
                class="elevation-1"
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
              
                <template v-slot:item.action="{ item }">
                  <v-icon @click="deleteZakaz(item)" >mdi-delete-outline</v-icon>
                </template>

              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
</template>

<script>
import axios from 'axios'
import {mapGetters} from 'vuex'
export default {
    data(){
        return {
            type:"month",
            events:[],
            showCalendar:false,
            serchStr:"",
            headers: [
                {
                    text: 'Номер заказа',
                    align: 'start',
                    value: 'zak_numbet',
                },
                { text: 'Дата', value: 'zak_data' },
                { text: 'Дата выполнения', value: 'zak_final_data' },
                { text: 'Клиент', value: 'klient_name' },
                { text: 'Телефон', value: 'phone' },
                { text: 'Сумма', value: 'summa_sheta' },
                { text: '', value: 'action' },
            ],

            zakazList: [
                
            ],
        }
    },

    computed: {
            ...mapGetters (["REST_API_PREFIX"])
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
        },

        deleteZakaz(item) {
          console.log(item);
        },

        getTovarInBase() {
          axios.get(this.REST_API_PREFIX + 'get_zakaz',
                {
                    params: {
                        querystr: this.serchStr,
                        status:"Новый"
                    }
                })
                .then( (resp) => {
                    this.zakazList = resp.data; 
                    console.log(resp);
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
    },

    created: function () {
       this.getTovarInBase();
    }
}
</script>

<style>

</style>