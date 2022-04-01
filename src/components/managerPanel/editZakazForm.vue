<template>
    <v-container class = "pd-2">
       <v-row class = "borderM">
            <v-col>
                <h1>Редактировать заказ</h1>
            </v-col>
        </v-row>
        <v-row class = "borderM marginM">
            <v-col md = "4" cols = "12">
                <div class="zakazStatus">
                    <span :class = "(zakazData.status == 'Новый')?'newZak':(zakazData.status == 'Архив')?'arhZak':'oldZak'">{{zakazData.status}}</span>
                </div>
            </v-col>

            <v-col v-if="zakazData.in_road_list != 0" md = "4" cols = "12">
                <span class = "label_input_ml">
                    Маршрутный лист № {{zakazData.in_road_list}} 
                       
                </span> 
                
                <v-btn small color="error" @click.prevent="clearMl();">
                    <v-icon class="mr-2">mdi-delete-outline</v-icon> Снять
                </v-btn> 
            </v-col>

            <v-col md = "4" cols = "12">
                <v-btn small  color="info" @click.prevent="updateZakToBase('Архив');">
                    <v-icon class="mr-2">mdi-archive-cog-outline</v-icon> Архивировать заказ
                </v-btn>
            </v-col>

        </v-row>
        <v-form  ref="addZakForm">
            <v-row>
                <v-col md = "6" cols = "12">
                    <v-text-field v-model="zakazData.zaknumber" label="Номер заказа" prepend-inner-icon="mdi-tag" readonly ></v-text-field>
                </v-col>
                
                <v-col md = "3" cols = "12">
                    <formating-data-piccer v-model="zakazData.data" show-label = "Дата оформления"></formating-data-piccer>
                </v-col>
                
                <v-col md = "3" cols = "12">
                    <formating-data-piccer v-model="zakazData.datafinal" show-label = "Дата выполнения"></formating-data-piccer>
         
                </v-col>
            </v-row>

            <v-row>
                <v-col md = "6" cols = "12" >
                    <v-text-field :rules="upp3Rules" v-model="zakazData.name" label="Клиент" prepend-inner-icon="mdi-account" req ></v-text-field>
                </v-col>
                <v-col md = "3"  cols="12">
                    <v-text-field  :rules="phoneRules" v-model="zakazData.phone" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone" ></v-text-field>
                </v-col>
                <v-col  md = "3" cols="12">
                    <v-text-field  v-model="zakazData.phone2" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone-outline" ></v-text-field>
                </v-col>
            </v-row>
                
            <v-row>
                <v-col >
                    <v-text-field :rules="upp3Rules"  v-model="zakazData.adr" label="Адрес доставки" prepend-inner-icon="mdi-map-marker-multiple" ></v-text-field>
                </v-col>
            </v-row>


            
            <v-row>
                <v-col md = "2" cols = "12">
                    <v-switch
                    color="success"
                    v-model="zakazData.beznal"
                    label="Безналичный расчет"
                    ></v-switch>
                </v-col>
                <v-col md = "5" cols = "12">
                    <v-text-field :disabled ="!zakazData.beznal" v-model="zakazData.shetn"  label="Номер счета 1С" prepend-inner-icon="mdi-file-document" ></v-text-field>
                </v-col>
                <v-col md = "5" cols = "12">
                    <v-text-field :disabled ="!zakazData.beznal" v-model="zakazData.shetsumm"  label="Сумма счета 1С" prepend-inner-icon="mdi-currency-rub"></v-text-field>
                </v-col>
            </v-row>

            
            <v-row>
                <v-col>
                    <v-data-table
                        dense
                        :headers="headers"
                        :items="zakazData.zaktovars"
                        item-key="sku"
                        class="elevation-1"
                        :items-per-page="-1"
                        :hideDefaultFooter = "true"
                    >
                        <template v-slot:[`item.img`]="{ item }">
                             <v-img
                                max-height="50"
                                max-width="50"
                                :src="item.img"
                                class="ma-1"
                            ></v-img>
                         </template>
                         
                         <template v-slot:[`item.count`]="{ item }">
                             <v-text-field
                                class="countFeild"
                                v-model="item.count"
                                @change="recalcZakTable"
                            ></v-text-field>
                         </template>

                         <template v-slot:[`item.price`]="{ item }">
                             <v-text-field
                                class="priceFeild"
                                v-model="item.price"
                                @change="recalcZakTable"
                            ></v-text-field>
                         </template>

                        <template v-slot:[`item.sale`]="{ item }">
                             <v-text-field
                                class="countFeild"
                                v-model="item.sale"
                                @change="recalcZakTable"
                            ></v-text-field>
                         </template>

                         <template v-slot:[`item.edin`]="{ item }">
                            <v-select
                                :items="['Шт', 'М']"
                                v-model="item.edin"
                                label="Единицы"
                                class = "table_select"
                            ></v-select>
                         </template>

                         <template v-slot:[`item.nal`]="{ item }">
                            <v-select
                                :items="['Да', 'Нет']"
                                v-model="item.nal"
                                label="Наличие"
                                class = "table_select"
                            ></v-select>
                         </template>


                        <template v-slot:[`item.cerecter`]="{ item }">
                             <v-text-field
                                v-model="item.cerecter"
                                @change="recalcZakTable"
                                label="Характеристики"
                            ></v-text-field>
                        </template>

                         <template v-slot:[`item.comment`]="{ item }">
                             <v-text-field
                                v-model="item.comment"
                                label="Комментарий"
                            ></v-text-field>
                         </template>

                         <template v-slot:[`item.action`]="{ index }">
                             <v-icon @click="deleteTovElement(index)" >mdi-delete-outline</v-icon>
                         </template>
                    </v-data-table>                    
                </v-col>
            </v-row>
            
            <v-row>
                <v-col class="d-flex flex-column">
                    <span class = "ml-auto"><strong>Итого: {{zakazData.totalsumm}} р.</strong></span>
                    <span class = "ml-auto"><strong>Итого без скидки: {{summWitchSale}} р.</strong></span>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-btn width = "100%" @click="showDialog" color="secondary">
                        <v-icon  class="mr-2">mdi-plus</v-icon> Добавить товар
                    </v-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-textarea
                        label="Комментарий к заказу"
                        v-model = "zakazData.comment"
                        hint="Введите комментарий к заказу"
                        rows="2"
                    ></v-textarea>
                </v-col>
            </v-row>

            <add-tovar-dialog :show-dlg="addTovarDialogShow" :close-dlg="cloaseDlg" :add-to-zak = "addTovarToZak"></add-tovar-dialog>  
                
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
                

                <v-col md = "4" cols="12">
                    <v-btn @click.prevent="updateZakToBase('Черновик');" color="success">
                        <v-icon class="mr-2">mdi-content-copy</v-icon> Сохранить как черновик
                    </v-btn>
                </v-col>
                <v-col md = "4" cols="12" class = "ml-auto justify-xl-end justify-md-end d-flex .d-md">
                    <v-btn  @click.prevent="updateZakToBase('Новый'); " color="success">
                        <v-icon class="mr-2">mdi-content-save</v-icon> Сохранить заказ
                    </v-btn>
                </v-col>

                <v-col md = "4" cols="12" class = "ml-auto justify-xl-end justify-md-end d-flex .d-md">
                    <v-btn tile color="success" class = "ml-4" target="_blank" :href = "'https://lightsnab.ru/wp-content/themes/light-shop/excel_kp/kp.php?number='+this.$route.params.number">                        
                        <v-icon left>mdi-microsoft-excel</v-icon> Скачать КП
                    </v-btn>
                </v-col>

            </v-row>

            <v-row>
                <v-col>
                    <h2>Перенос заказа на другую дату</h2>        
                </v-col>
            </v-row>
        
            <zak-perenos :old-zak-number = "zakazData.zaknumber"></zak-perenos>

        </v-form>

        <!-- <v-row v-else > 
            <v-col>
                <p class="obrlnk">Данные не загружены <router-link :to = "{name:'service'}"> Вернуться на главную</router-link></p>
            </v-col>
        </v-row> -->

        

    </v-container>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex'
import addTovarDialog from './addTovarDialog.vue';
import zakPerenos from './zakPerenos.vue';
import FormatingDataPiccer from '../formatingDataPiccer.vue';

export default {
    components: { addTovarDialog, FormatingDataPiccer, zakPerenos},
    data() {
        return {
            menu:false,
            addTovarDialogShow:false,
            zakazData: {
                mng_name:localStorage.getItem("fio"),
                mng_mail:localStorage.getItem("mail"),
                zak_id:"",
                zaknumber:"",
                data:"",
                datafinal:"",
                name:"",
                phone:"",
                phone2:"",
                adr:"",
                beznal:false,
                shetn:"",
                shetsumm:0,
                totalsumm:0,
                comment:"",
                status:"",
                zaktovars:[ 
                
                ]
            },

            summWitchSale:0,
            
            requiredRules:[
                value => !!value || 'Должно быть заполнено.'
            ],
            upp3Rules:[
                value => (value && value.length >= 3) || 'Должно быть больше 3 символов',
            ],
            phoneRules:[
                value => (value && value.length >= 18) || 'Телефон некорректен',
            ],

            alertType: "error",
            showAlert: false,
            message: "",

            headers: [
                {text: "Изображение", value: "img"},
                {text: "Наименование", value: "name"},
                {text: "Характеристики", value: "cerecter"},
                {text: "Артикул", value: "sku"},
                {text: "Количество", value: "count"},
                {text: "Цена", value: "price"},
                {text: "Скидка", value: "sale"},
                {text: "Сумма", value: "summ"},
                {text: "Един.", value: "edin"},
                {text: "Наличие", value: "nal"},
                {text: "Комментарий", value: "comment"},
                {text: "", value: "action"}
            ],

        }
    },
    
    computed: {
            ...mapGetters (["REST_API_PREFIX", "MAIN_ORDER_LIST"])
    },


    mounted: function() {
        console.log(this.MAIN_ORDER_LIST);

        this.getZakInBase();
    },



    methods:{
        clearMl() 
        {
            axios.delete(this.REST_API_PREFIX + 'delete_delivery_in_road_list_by_zak',
            {
                params: {
                    mlid: this.zakazData.in_road_list,
                    number:this.$route.params.number
                }
            })
            .then( (resp) => {
                console.log(resp);
                this.zakazData.in_road_list = 0
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

        getZakTovarInBase() {
            axios.get(this.REST_API_PREFIX + 'get_order_tovar',
                {
                    params: {
                        orderid: this.$route.params.number,
                    }
                })
                .then( (resp) => {
                console.log(resp);
                 this.zakazData.zaktovars = resp.data
                 this.recalcZakTable()
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

        getZakInBase() {
            axios.get(this.REST_API_PREFIX + 'get_zakaz_info',
            {
                params: {
                    number: this.$route.params.number,
                }
            })
            .then( (resp) => {
                console.log(resp)
                        this.zakazData.zak_id = resp.data.id
                        this.zakazData.mng_name = resp.data.mng_name
                        this.zakazData.mng_mail = resp.data.mng_mail
                        this.zakazData.zaknumber = resp.data.zak_numbet
                        this.zakazData.data = resp.data.zak_data
                        this.zakazData.datafinal = resp.data.zak_final_data
                        this.zakazData.name = resp.data.klient_name
                        this.zakazData.phone = resp.data.phone
                        this.zakazData.phone2 = resp.data.phone2
                        this.zakazData.adr = resp.data.adres
                        this.zakazData.beznal = (resp.data.beznal == 0)?false:true
                        this.zakazData.shetn = resp.data.nomer_sheta_1c
                        this.zakazData.shetsumm = resp.data.summa_sheta_1c
                        this.zakazData.totalsumm = resp.data.total_summ
                        this.zakazData.comment = resp.data.comment
                        this.zakazData.status = resp.data.status
                        this.zakazData.in_road_list = resp.data.in_road_list

                        this.getZakTovarInBase();
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

        recalcZakTable() {
            this.zakazData.totalsumm = 0;
            this.summWitchSale = 0;
            this.zakazData.zaktovars.forEach((elem) => {
                if (elem.price == "") elem.price = 0
                if (elem.count == "") elem.count = 1
                if (elem.sale == "") elem.sale = 0
                elem.summ = (elem.sale === 0)?parseFloat(elem.count) * parseFloat(elem.price):(parseFloat(elem.count) * parseFloat(elem.price) * (1 - parseFloat(elem.sale)/100));
                this.zakazData.totalsumm += parseFloat(elem.summ);
                this.summWitchSale += parseFloat(parseFloat(elem.count) * parseFloat(elem.price));
            });

            console.log(this.zakazData.zaktovars);
        },
        deleteTovElement (index) {
            console.log(index);
            this.zakazData.zaktovars.splice(index, 1);
            this.recalcZakTable();
        },

        cloaseDlg() {
            this.addTovarDialogShow = false;
        },
        showDialog() {
            this.addTovarDialogShow = !this.addTovarDialogShow;
        },

        addTovarToZak(element) {

            for (let i = 0; i<this.zakazData.zaktovars.length; i++){
                if (this.zakazData.zaktovars[i].sku == element.sku) {
                    this.zakazData.zaktovars[i].count =  parseFloat(this.zakazData.zaktovars[i].count)+1;
                    console.log(this.zakazData.zaktovars[i].count)
                    this.recalcZakTable();
                    return;
                }
            }

            this.zakazData.zaktovars.push({
                img: element.img,
                name: element.name,
                cerecter: element.cerecter,
                sku: element.sku,
                count: element.count,
                price: element.price,
                sale: element.sale,
                summ: element.summ,
                edin:element.edin,
                nal:element.nal,
                comment:element.comment
            })

            this.recalcZakTable();
            
        },

        updateZakToBase(status) {
            console.log(this.$route.params.number);
            console.log(this.zakazData);
            if (this.$refs.addZakForm.validate())
            {
                axios.post(this.REST_API_PREFIX + 'update_zak',
                {
                        zaknumber: this.$route.params.number,
                        zakinfo: this.zakazData,
                        status:status
        
                })
                .then( (resp) => {
                    this.message = "Данные добавленны"
                    this.alertType = "success";
                    this.showAlert = true;
                    console.log(resp);
                    this.zakazData.status = status
                        
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
            else 
            {
                this.message = "Не заполнены обязательные поля!"
                this.showAlert = "error";
                this.showAlert = true;
            }
        }
    }
}
</script>

<style>

.label_input_ml {
    margin: auto 10px auto 0;
}

.countFeild {
    max-width: 50px;
}
.priceFeild {
    max-width: 80px;
}

.table_select {
    max-width: 100px;
}

.zakazStatus span{
    padding: 5px 10px;
    border-radius: 5px;
}

.oldZak {
    background-color: #9ACEEB;
}

.arhZak {
    background-color: lightgray;
}

.newZak {
    background-color: #BDECB6;
}
</style>