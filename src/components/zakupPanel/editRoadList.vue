<template>
    <v-container class = "pd-2" >
      <v-row class="borderM">
        <v-col>
            <h1>Маршрутные листы № {{this.$route.params.listid}} на {{(mlInfo.length == 0)?"":formatDate(mlInfo[0].data)}}</h1>
        </v-col>
      </v-row>

      <v-row  class="borderM">
          <v-col>
              <v-btn class = "rodlist" elevation="2" small @click.prevent="$router.push({name:'roatlists'})" > К списку</v-btn>
              <v-btn class = "rodlist" v-for="(item, i) in mlNext" :key="i" elevation="2" small @click.prevent="$router.push({name:'editroadlist', params: {listid: item.id}}, () => {
                    getRoadListData()
                    getZakazToDate()
                  } )">№ {{item.id}} на {{formatDate(item.data)}}</v-btn>
          </v-col>
      </v-row>
      <v-row>
          <v-col>
                <v-alert
                    border="right"
                    colored-border
                    :type = "alertType"
                    elevation="2"
                    v-show="showAlert"
                    class="mt-8"
                >{{message}}</v-alert> 
          </v-col>
      </v-row>
      <v-row>
          <v-col class ="pa-4 borderRight" md = "6" cols="12">
              <h2>Добавить склад</h2>
                <v-form style = "margin-bottom: 30px;" ref="addZakForm">
                    <v-autocomplete
                        v-model = "skladinfo.skladid"
                        :items = "ALL_SCLAD_INFO"
                        label = "Склад"
                        item-text="name"
                        item-value="id"
                       
                        @change="getScladName"
                        :rules="requiredRules"

                    ></v-autocomplete> 

                    <v-text-field :rules="requiredRules"  label = "Документ" v-model="skladinfo.document"></v-text-field>
                
                    <v-select
                        v-model = "skladinfo.pay"
                        :items = "['Оплачен','Оплата на месте']"
                        label = "Оплата"
                    
                        :rules="requiredRules"
                    ></v-select>

                    <v-text-field label = "Цена" v-model="skladinfo.price"></v-text-field>
                    <v-text-field label = "Комментарий" v-model="skladinfo.comment"></v-text-field>
                    
                    <v-btn class="mt-8" @click="addToSclad()" color="success">
                        <v-icon class="mr-2">mdi-plus</v-icon> Добавить в лист
                    </v-btn>

                </v-form>
              <h2>Добавить Доставку</h2>
              <v-form style = "margin-bottom: 30px;" ref="addDeliveryForm">
                  <formating-data-piccer @change="getZakazToDate" v-model="mainData" show-label = "Все заказы на дату"></formating-data-piccer>
              </v-form>
              <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th>Заказ</th>
                                        <th>Менеджер</th>
                                        <th>Клиент</th>
                                        <th>Адрес</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for = "(item_info,  key, i) in allZakInData" :key="i" >
                                        <td><span class = "lincToZak" @click.prevent = "$router.push({name:'editzak', params: {number: item_info.zak_numbet}})">{{item_info.zak_numbet}}</span></td>
                                        <td>{{item_info.mng_name}}</td>
                                        <td>{{item_info.klient_name}}</td>
                                        <td>{{item_info.adres}}</td>
                                        <td><v-icon class = "mr-2" @click="addDeliveryToMl(item_info)" title = "Добавить в доставку" >mdi-arrow-right</v-icon></td>
                                    </tr>
                                </tbody>
                            </template>
                </v-simple-table>
          </v-col>
          
          <v-col class ="pa-4" md = "6" cols="12">
              <div class="ml_control">
                    <v-btn class="mt-4 mb-4" target="_blank" :href = "'https://lightsnab.ru/wp-content/themes/light-shop/excel_kp/roadlist.php?rlid='+this.$route.params.listid" color="success">
                        <v-icon class="mr-2">mdi-microsoft-excel</v-icon> Скачать маршрутный лист
                    </v-btn>
              </div>

              <div class="ml_v_wriper">
                  <h2>Склады</h2>
                  <div v-for="(item,  key, i) in mlSkladArray" :key="i" class="ml_v_blk">
                      <div class="scladname">
                          <span>{{key}}</span>
                      </div>
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th>Документ</th>
                                        <th>Оплата</th>
                                        <th>Цена</th>
                                        <th>Комментарий</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for = "(item_info,  key, i) in item" :key="i" >
                                        <td>{{item_info.document}}</td>
                                        <td>{{item_info.pay}}</td>
                                        <td>{{item_info.price}}</td>
                                        <td>{{item_info.commen}}</td>
                                        <td><v-icon class = "mr-2" title = "Удалить поле" @click="deleteSclad(item_info)" >mdi-delete-outline</v-icon></td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                  </div>
                  <h2>Доставки</h2>
                  <div v-for="(item,  key, i) in mlDeliveryArray" :key="i" class="ml_v_blk">
                      <div class="scladname deliveryAdr">
                          <span>{{item.adres}} ({{item.zak_numbet}})</span>
                          <v-icon class = "mr-2" title = "Удалить поле" @click="deleteDelivery(item)" >mdi-delete-outline</v-icon>
                      </div>
                      <div class="delivery_info">
                          <strong>Клиент:</strong>{{item.klient_name}}<br>
                          <strong>Телефон:</strong>{{item.klient_phone}}<br>
                          <strong>Комментарий:</strong>{{item.comment}}<br>
                      </div>
                  </div>
              </div>
          </v-col>
      </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex'
import formatingDataPiccer from '../formatingDataPiccer.vue';
export default {
    components: { formatingDataPiccer },
    data(){
        return {
            skladinfo: {
                skladid:0,
                price:"",
                skladname:"",
                document:"",
                pay:"",
                comment:""
            },

            requiredRules:[
                value => !!value || 'Должно быть заполнено.'
            ],

            alertType: "error",
            showAlert: false,
            message: "",

            mlSkladArray:[],
            mlDeliveryArray:[],
            mlInfo:[],
            mlNext:[],

            mainData:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

            allZakInData:[],
        }
    },
    
    computed: {
      ...mapGetters (["REST_API_PREFIX", "ALL_SCLAD_INFO", "USER_STATUS", "USER_EMAIL"])
    },

    methods:{
        formatDate (date) {
          if (!date) return null
          const [year, month, day] = date.split('-')
          return `${day}.${month}.${year}`
        },

        deleteSclad(item) 
        {
            axios.delete(this.REST_API_PREFIX + 'delete_sclad_in_road_list',
            {
                params: {
                    id: item.id,
                }
            })
            .then( (resp) => {
                console.log(resp);
                this.getZakazToDate()
                this.getRoadListData()
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
        deleteDelivery(item) 
        {
            axios.delete(this.REST_API_PREFIX + 'delete_delivery_in_road_list',
            {
                params: {
                    id: item.id,
                    number:item.zak_numbet
                }
            })
            .then( (resp) => {
                console.log(resp);
                this.getZakazToDate()
                this.getRoadListData()
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
        addDeliveryToMl(item) {
             axios.post(this.REST_API_PREFIX + 'add_delivery_to_road_list',
                {
                        rlid: this.$route.params.listid,
                        zaknumber: item.zak_numbet,
                        mail:this.USER_EMAIL,
                        deliveryinfo:item
        
                })
                .then( (resp) => {
                    this.message = "Данные доставки добавленны"
                    this.alertType = "success";
                    this.showAlert = true;
                    this.getZakazToDate()
                    this.getRoadListData()
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
        },
        getZakazToDate() {
            console.log(this.mainData);
            axios.get(this.REST_API_PREFIX + 'get_zakaz_for_ml',
                        {
                            params: {
                                data: this.mainData,
                                status: this.USER_STATUS,
                                mail: this.USER_EMAIL,
                            }
                        })
                        .then( (resp) => {
                            this.allZakInData = resp.data

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
        },
        getRoadListData() {
            axios.get(this.REST_API_PREFIX + 'get_road_list_data',
                        {
                            params: {
                                mlid: this.$route.params.listid,
                                status: this.USER_STATUS,
                                mail: this.USER_EMAIL,
                            }
                        })
                        .then( (resp) => {
                            this.mlSkladArray = resp.data.sklads
                            this.mlDeliveryArray = resp.data.delivery
                            this.mlInfo = resp.data.roadlist
                            this.mlNext = resp.data.roadlist_next
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
        },
        getScladName(scladname) {
            for (let i = 0; i<this.ALL_SCLAD_INFO.length; i++)
                if (this.ALL_SCLAD_INFO[i].id == scladname)  {
                    this.skladinfo.skladname = this.ALL_SCLAD_INFO[i].name
                    console.log(this.skladinfo.skladname)
                    return 
                }
        },
        addToSclad() {
            if (this.$refs.addZakForm.validate()) {
                axios.post(this.REST_API_PREFIX + 'add_sclad_to_road_list',
                {
                        rlid: this.$route.params.listid,
                        scladinfo: this.skladinfo,
                        mail:this.USER_EMAIL,
        
                })
                .then( (resp) => {
                    this.message = "Данные склада добавленны"
                    this.alertType = "success";
                    this.showAlert = true;
                    this.getZakazToDate()
                    this.getRoadListData()
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
        }
    },

    mounted: function() {
        this.getRoadListData()
        this.getZakazToDate()
        if (this.ALL_SCLAD_INFO.length == 0) 
            this.$store.dispatch('getAllScladInfo');

    }
}
</script>

    <style>
    .rodlist {
        margin: 5px 20px 5px 0;
    }

    .lincToZak {
        color:#4caf50;
        cursor: pointer;
    }
    .scladname {
        padding: 10px 20px;
        background-color: lightskyblue;
        display: flex;
        justify-content: space-between;
    }

    .deliveryAdr {
        background-color: lightgreen;
    }

    .borderRight {
        border-right: 1px solid lightgrey;
    }
</style>