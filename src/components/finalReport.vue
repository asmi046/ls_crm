<template>
    <v-container class = "pd-2" >
      <h1>Отчет о продажах</h1>
      <v-form ref = "filterReportForm">
          <v-row>
            <v-col>
                <formating-data-piccer v-model="startData" show-label = "Начиная с даты"></formating-data-piccer>    
            </v-col>
            <v-col>
                <formating-data-piccer v-model="endData" show-label = "По дату"></formating-data-piccer>    
            </v-col>
            <v-col>
                <v-select
                    v-model = "managerEmail"
                    :items = "MANAGER_EMAIL_LIST"
                    label = "Менеджер"
                    item-text="name"
                    item-value="mail"
                    hide-details = true,
                ></v-select> 
            </v-col>
            <v-col>
                <v-btn @click="getReport()" width = "100%" class = "mt-3" color="success">
                          <v-icon class="mr-2">mdi-chart-arc</v-icon> Сформировать отчет
                </v-btn>
            </v-col>
          </v-row>
          
      </v-form>
            <v-row>
                <v-col>
                  <v-data-table
                    locale="ru-RU"
                    :headers="headers"
                    :items="mngReport"
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
                    </v-data-table>
                </v-col>
            </v-row>
            
            <v-row>
                <v-col>
                    <h2>Детализация по менеджерам</h2>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-btn :disabled="mngDetails.length == 0" class="mt-4 mb-4" target="_blank" :href = "'https://lightsnab.ru/wp-content/themes/light-shop/excel_kp/details.php?start='+startData+'&end='+endData+'&manager='+managerEmail" color="success">
                        <v-icon class="mr-2">mdi-microsoft-excel</v-icon> Сохранить в excel
                    </v-btn>
                </v-col>
            </v-row>
            
            <v-row>
                <v-col>
                    <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">№</th>
                                <th class="text-left">Номер заказа</th>
                                <th class="text-left">Менеджер</th>
                                <th class="text-left">Дата выполнения</th>
                                <th class="text-left">Клиент</th>
                                <th class="text-left">Счет 1С</th>
                                <th class="text-left">Цена безнал</th>
                                <th class="text-left">Цена нал</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in mngDetails" :key="index">
                                <td>{{ index }}</td>
                                <td>{{ item.zak_numbet }}</td>
                                <td>{{ item.mng_name }}</td>
                                <td>{{ item.zak_final_data }}</td>
                                <td>{{ item.klient_name }}</td>
                                <td>{{ item.nomer_sheta_1c }}</td>
                                <td>{{ item.summa_sheta_1c }}</td>
                                <td>{{ item.total_summ }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>

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
import formatingDataPiccer from './formatingDataPiccer.vue'
export default {
    components: { formatingDataPiccer },
    data() {
        return {
            startData:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            endData:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            managerEmail:"",
            mngReport:[],
            mngDetails:[],
            headers: [
                {
                    text: 'Менеджер',
                    value: 'mng_name',
                },
                { text: 'e-mail', value: 'mng_mail' },
                { text: 'Выполнено заказов', value: 'zakaz_count' },
                { text: 'Продажи безнал', value: 'zakaz_summ_1c' },
                { text: 'Продажи нал', value: 'zakaz_summ_nal' },
            ],

            alertType: "error",
            showAlert: false,
            message: "",
        }
    },

    computed: {
      ...mapGetters (["REST_API_PREFIX", "MANAGER_EMAIL_LIST", "USER_STATUS"])
    },

    mounted: function() {
        if (this.MANAGER_EMAIL_LIST.length == 0) 
            this.$store.dispatch('updateManagerInfo')    
    },
    
    methods: {
        getReport() {
                axios.get(this.REST_API_PREFIX + 'sale_report',
                {
                    params: {
                        start:this.startData,
                        end:this.endData,
                        manager:this.managerEmail
                    }
                })
                .then( (resp) => {
                    this.mngReport = resp.data.result.slice()
                    this.mngDetails = resp.data.detail.slice()
                    console.log(this.mngReport);
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
    }
}
</script>

<style>

</style>