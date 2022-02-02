<template>
  <v-container class = "pd-1 wa-xl-" >
          
          <v-form>
            <v-row class = "mb-3">
              
                <v-col >
                    <v-text-field @input="getTovarInBase" hide-details = true v-model = "serchStr" label="Введите запрос" prepend-inner-icon="mdi-magnify" ></v-text-field>                
                </v-col>
                
                <v-col v-show="USER_STATUS === 'admin'" md = "2" cols="12">
                  <v-select
                    v-model = "managerEmail"
                    :items = "MANAGER_EMAIL_LIST"
                    label = "Менеджер"
                    item-text="name"
                    item-value="mail"
                    hide-details = true,
                    @change="getTovarInBase"
                  ></v-select>           
                </v-col>

                <v-col md = "2" cols="12">
                  <v-select
                    v-model = "serchStatus"
                    :items = "ORDER_STATUSES"
                    label = "Со статусом"
                    hide-details = true,
                    @change="getTovarInBase"
                  ></v-select>           
                </v-col>
                
                <v-col md = "2" cols="12">
                    <v-btn @click="serchStatus = ''; serchStatus = ''; managerEmail = ''; getTovarInBase()" width = "100%" class = "mt-3" color="success">
                          <v-icon class="mr-2">mdi-minus-circle-outline</v-icon> Сбросить
                    </v-btn>               
                </v-col>
              
            </v-row>
          </v-form>

          <v-row>
            <v-col>
              <v-btn tile :color="(!showCalendar)?'success':'error'"  @click.prevent="showCalendar = !showCalendar; if (events.length == 0) getEvents()">
                <v-icon left>mdi-calendar</v-icon>
                  <span v-text = "(!showCalendar)?'Показать календарь':'Скрыть календарь'">Показать календарь</span>
              </v-btn>              
            </v-col>
          </v-row>
          
          <v-row v-show = "showCalendar">
            <v-col>
                <div class="calendarAction">
                  
                  <v-btn fab text small color="grey darken-2" @click="$refs.calendar.prev()">
                    <v-icon small>mdi-chevron-left</v-icon>
                  </v-btn>

                  <div v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </div>

                  <v-btn fab text small color="grey darken-2" @click="$refs.calendar.next()">
                    <v-icon small>mdi-chevron-right</v-icon>
                  </v-btn>

                </div>
                <v-sheet width="100%">
                  <v-calendar 
                    locale="ru"
                    v-model="focus"
                    :type = "type" 
                    :events = "events" 
                    @change="getEvents"
                    @click:event="editZakaz"
                    ref="calendar"
                    ></v-calendar>
                </v-sheet>
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
                <v-data-table
                locale="ru-RU"
                :headers="headers"
                :items="MAIN_ORDER_LIST"
                :items-per-page="30"
                item-key="name"
                class="elevation-1"
                :sort-by.sync="sb"
                :sort-desc.sync="sd"

                :item-class="itemRowBackground"
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
              
                <template v-slot:[`item.zak_data`]="{ item }">
                  {{formatDate(item.zak_data)}}
                </template>

                <template v-slot:[`item.zak_final_data`]="{ item }">
                  {{(item.status !== 'Черновик')?formatDate(item.zak_final_data):''}}
                </template>

                <template v-slot:[`item.action`]="{ item }">
                  <v-icon title = "Редактировать заказ" class = "mr-2" @click = "$router.push({name:'editzak', params: {number: item.zak_numbet}})" >mdi-clipboard-edit-outline</v-icon>
                  <v-icon title = "Сформировать коммерческое предложение" class = "mr-2" @click = "$router.push({name:'kp', params: {number: item.zak_numbet}})" >mdi-cloud-print-outline</v-icon>
                  <v-icon title = "Удалить заказ" class = "mr-2" @click="deleteZakaz(item)" >mdi-delete-outline</v-icon>
                </template>

              </v-data-table>
            </v-col>
          </v-row>

          <delete-dialog :delete-dialog-param = "deleteDialogParam"></delete-dialog>

        </v-container>
</template>

<script>
import axios from 'axios'
import {mapGetters} from 'vuex'
import deleteDialog from '../deleteDialog.vue'
export default {
    components: { deleteDialog },
    data(){
        return {
          sb:'zak_data',
          sd:true,
            focus: '',
            type:"month",
            events:[],
            showCalendar:false,
            serchStr:"",
            serchStatus:"",
            managerEmail:"",
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
                { text: 'Сумма (нал.)', value: 'total_summ' },
                { text: '№ счета (1C)', value: 'nomer_sheta_1c' },
                { text: 'Сумма (1C)', value: 'summa_sheta_1c' },
                { text: 'Статус', value: 'status' },
                { text: '', value: 'action' },
            ],

            zakazList: [
                
            ],

            alertType: "error",
            showAlert: false,
            message: "",

            deleteDialogParam: {
              showDialog:false,
              id:"",
              number:"",
              closeDialog: () => {
                  this.deleteDialogParam.showDialog = false;
              },

              deleteNumber: () => {
                  axios.delete(this.REST_API_PREFIX + 'del_order',
                  {
                      params: {
                          orderid: this.deleteDialogParam.id,
                      }
                  })
                  .then( (resp) => {
                    console.log(resp);
                    this.getTovarInBase();
                    this.message = "Данные успешно удалены"
                    this.alertType = "success";
                    this.showAlert = true;
                    this.deleteDialogParam.showDialog = false;
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

                      this.message = rezText
                      this.showAlert = "error"
                      this.showAlert = true;

                      this.deleteDialogParam.showDialog = false;
                  });
              }
            },
        }
    },

    computed: {
      ...mapGetters (["REST_API_PREFIX", "ORDER_STATUSES", "MAIN_ORDER_LIST", "MANAGER_EMAIL_LIST", "USER_STATUS"])
    },

    methods: {
          itemRowBackground: function (item) {
            if (item.status == "Новый")
                return "bg_new";
            if (item.status == "Черновик")
                return "bg_draw";
            if (item.status == "В работе")
                return "bg_invork";
            if (item.status == "Архив")
                return "bg_arhiv";
            
        },
        formatDate (date) {
          if (!date) return null
          const [year, month, day] = date.split('-')
          return `${day}.${month}.${year}`
        },
        editZakaz({ event }) {
          this.$router.push({name:'editzak', params: {number: event.id}})
        },
        getEvents () {
            
            let ev = [];

            for (let i = 0; i<this.MAIN_ORDER_LIST.length; i++) {
              let color = "#a1a1a1"

              if (this.MAIN_ORDER_LIST[i].status === "Новый")
                color = "#347815"
              
              if (this.MAIN_ORDER_LIST[i].status === "Черновик")
                color = "#707070"

              ev.push({
                name: this.MAIN_ORDER_LIST[i].zak_numbet+" "+this.MAIN_ORDER_LIST[i].klient_name,
                id: this.MAIN_ORDER_LIST[i].zak_numbet,
                color: color,
                start:new Date(this.MAIN_ORDER_LIST[i].zak_final_data),
              });
            }

            this.events = ev;
        },

        deleteZakaz(item) {
          console.log(item);
          this.deleteDialogParam.id = item.id
          this.deleteDialogParam.number = item.zak_numbet
          this.deleteDialogParam.showDialog = true
        },

        getTovarInBase() {
          this.$store.dispatch('updateOrderList',  {serch_str: this.serchStr, serch_status: this.serchStatus, search_mail: this.managerEmail})
        }
    },

    created: function () {
       this.getTovarInBase();
       this.$store.dispatch('updateManagerInfo')
    },


}
</script>

<style>

  .calendarAction {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .bg_new {
    background-color: #BDECB6;
  }

  .bg_draw{
    background-color: #9ACEEB;
  }

  .bg_invork {
    background-color: #FFF44F;
  }

  .bg_arhiv {
    background-color: #DBD7D2;
  }

</style>