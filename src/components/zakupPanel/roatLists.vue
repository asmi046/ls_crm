<template>
  <v-container class = "pd-2" >
      <h1>Маршрутные листы</h1>
      <v-form ref = "roadListForm">
          <v-row>
            <v-col md = "4" cols="12">
                <formating-data-piccer  v-model="startData" show-label = "Начиная с даты"></formating-data-piccer>    
            </v-col>
            <v-col md = "4" cols="12">
                <formating-data-piccer  v-model="endData" show-label = "По дату"></formating-data-piccer>    
            </v-col>
            <v-col md = "2" cols="12">
                <v-select
                    v-model = "status"
                    :items = "statusItems"
                    label = "Статус"
                    item-text="name"
                    item-value="value"
                    hide-details = true
                ></v-select> 
            </v-col>
            <v-col md = "2" cols="12">
              <v-btn @click="getRoadList()" width = "100%" class = "mt-3" color="success">
                <v-icon class="mr-2">mdi-filter-outline</v-icon> Найти
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col md = "4" cols="12">
                <v-btn @click="addRoadList();" width = "100%" class = "mt-3" color="success">
                          <v-icon class="mr-2">mdi-plus</v-icon> Создать маршрутный лист
                </v-btn>
            </v-col>
          </v-row>
          
      </v-form>
            <v-row>
                <v-col>
                  <v-data-table
                    locale="ru-RU"
                    :headers="headers"
                    :items="roadLists"
                    :items-per-page="30"
                    class="report_table"
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
                        <template v-slot:[`item.data`]="{ item }">
                            <formating-data-piccer @change="updateList(item)" v-model="item.data" show-label = "Дата"></formating-data-piccer>    
                        </template>

                        <template v-slot:[`item.driver`]="{ item }">
                            <v-text-field
                                class="fieldInTable"
                                v-model="item.driver"
                                label="Водитель"
                                @change="updateList(item)"
                            ></v-text-field>
                        </template>

                        <template v-slot:[`item.comment`]="{ item }">
                            <v-text-field
                                class="fieldInTable"
                                v-model="item.comment"
                                label="Комментарий"
                                @change="updateList(item)"
                            ></v-text-field>
                        </template>

                        <template v-slot:[`item.status`]="{ item }">
                            <v-select
                                v-model = "item.status"
                                :items = "['Активный','Выполнен']"
                                label="Статус"
                                hide-details = true,
                                @change="updateList(item)"
                              
                            ></v-select>

                        </template>

                        <template v-slot:[`item.control`]="{ item }">
                            <v-icon class = "mr-2" title = "Редактировать заказ" @click="$router.push({name:'editroadlist', params: {listid: item.id}})" >mdi-clipboard-edit-outline</v-icon>
                            <!-- <v-icon class = "mr-2" title = "Удалить заказ" @click="deleteList(item)" >mdi-delete-outline</v-icon> -->
                        </template>

                    </v-data-table>
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
  </v-container>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex'
import formatingDataPiccer from '../formatingDataPiccer.vue'
export default {
    components: { formatingDataPiccer },
    data() {
        return {
            createData:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            startData:(new Date(Date.now() - 864000000 - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            endData:(new Date(Date.now() + 864000000 - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            status:"%",
            statusItems: [
              {name:"Все", value:"%"},
              {name:"Выполнен", value:"Выполнен"},
              {name:"Активный", value:"Активный"}
            ],
            roadLists:[],
            headers: [
                {
                    text: 'Номер',
                    value: 'id',
                },
                { text: 'Дата', value: 'data' },
                { text: 'Водитель', value: 'driver' },
                { text: 'Статус', value: 'status' },
                { text: 'Комментарий', value: 'comment' },
                { text: '', value: 'control' },
            ],

            alertType: "error",
            showAlert: false,
            message: "",
        }
    },

    computed: {
      ...mapGetters (["REST_API_PREFIX"])
    },

    methods:{

      deleteList(item) {
            axios.delete(this.REST_API_PREFIX + 'del_road_list',
            {
                params: {
                    listid: item.id,
                }
            })
            .then( (resp) => {
              console.log(resp);
              this.getRoadList()
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

      updateList(item) {
        var formData = new FormData();
        formData.append("id", item.id);
        formData.append("data", item.data);
        formData.append("status", item.status);
        formData.append("driver", item.driver);
        formData.append("comment", item.comment);

            axios.post(this.REST_API_PREFIX + 'update_road_list', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then( (resp) => {
                console.log(resp)
                this.getRoadList()
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
      },

      addRoadList() {
        var formData = new FormData();
        formData.append("data", this.createData);

            axios.post(this.REST_API_PREFIX + 'add_road_list', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then( (resp) => {
                console.log(resp)
                this.getRoadList()
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
      },

      getRoadList() {
        axios.get(this.REST_API_PREFIX + 'get_road_list',
            {
                params: {
                    start: this.startData,
                    end: this.endData,
                    status: this.status,
                }
            })
            .then( (resp) => {
              this.roadLists = resp.data.result.slice()
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
                
                this.message = rezText
                this.showAlert = "error"
                this.showAlert = true
        });
      }
    },

    mounted:function(){
      console.log(Date.now() - 1440000 - (new Date()).getTimezoneOffset() * 60000)
      console.log(this.startData)
      console.log(this.endData)
      this.getRoadList()
    }
}
</script>

<style>

</style>