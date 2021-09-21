<template>
    <v-container class = "pd-2">
       <v-row>
            <v-col>
                <h1>Создать заказ</h1>
            </v-col>
        </v-row>
        <v-form ref="addZakForm">
            <v-row>
                <v-col md = "6" cols = "12">
                    <v-text-field @focus="generateZn" v-model="zakazData.zaknumber" label="Номер заказа" prepend-inner-icon="mdi-tag" readonly ></v-text-field>
                </v-col>
                
                <v-col md = "3" cols = "12">
                    <!-- <v-text-field @focus="generateZn" v-model="zakazData.data" label="Дата оформления" prepend-inner-icon="mdi-calendar" readonly ></v-text-field> -->
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
                    <v-text-field :rules="phoneRules" v-model="zakazData.phone" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone" ></v-text-field>
                </v-col>
                <v-col  md = "3" cols="12">
                    <v-text-field  :rules="phoneRules" v-model="zakazData.phone2" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone-outline" ></v-text-field>
                </v-col>
            </v-row>
                
            <v-row>
                <v-col >
                    <v-text-field :rules="upp3Rules"  v-model="zakazData.adr" label="Адрес доставки" prepend-inner-icon="mdi-map-marker-multiple" ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col md = "6" cols = "12">
                    <v-text-field v-model="zakazData.shetn"  label="Номер счета" prepend-inner-icon="mdi-file-document" ></v-text-field>
                </v-col>
                <v-col md = "6" cols = "12">
                    <v-text-field v-model="zakazData.shetsumm"  label="Сумма счета" prepend-inner-icon="mdi-currency-rub" readonly></v-text-field>
                </v-col>
            </v-row>

            
            <v-row>
                <v-col>
                    <v-data-table
                        dense
                        :headers="headers"
                        :items="zakazData.zaktovars"
                        item-key="name"
                        class="elevation-1"
                        :hideDefaultFooter = "true"
                    >
                        <template v-slot:item.img="{ item }">
                             <v-img
                                max-height="50"
                                max-width="50"
                                :src="item.img"
                                class="ma-1"
                            ></v-img>
                         </template>
                         <template v-slot:item.action="{ index }">
                             <v-icon @click="deleteTovElement(index)" >mdi-delete-outline</v-icon>
                         </template>
                    </v-data-table>                    
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
                

                <v-col md = "6" cols="12">
                    <v-btn @click.prevent="addZakToBase('Черновик')" color="success">
                        <v-icon class="mr-2">mdi-content-copy</v-icon> Сохранить как черновик
                    </v-btn>
                </v-col>
                <v-col md = "6" cols="12" class = "ml-auto justify-xl-end justify-md-end d-flex .d-md">
                    <v-btn  @click.prevent="addZakToBase('Новый')" color="success">
                        <v-icon class="mr-2">mdi-content-save</v-icon> Сохранить заказ
                    </v-btn>
                </v-col>

            </v-row>
        </v-form>



    </v-container>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex'
import addTovarDialog from './addTovarDialog.vue';
import FormatingDataPiccer from '../formatingDataPiccer.vue';

export default {
    components: { addTovarDialog, FormatingDataPiccer },
    data() {
        return {
            menu:false,
            addTovarDialogShow:false,
            zakazData: {
                zaknumber:"",
                data:"",
                datafinal:"",
                name:"",
                phone:"",
                phone2:"",
                adr:"",
                shetn:"",
                shetsumm:0,
                comment:"",
                zaktovars:[ 
                
                ]
            },
            
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
                {text: "Количество", value: "count"},
                {text: "Цена", value: "price"},
                {text: "Скидка", value: "sale"},
                {text: "Сумма", value: "summ"},
                {text: "", value: "action"}
            ],

        }
    },
    
    computed: {
            ...mapGetters (["REST_API_PREFIX"])
    },

    created: function() {
        this.generateZn()
    },



    methods:{

        deleteTovElement (index) {
            console.log(index);
            this.zakazData.zaktovars.splice(index, 1);
        },

        cloaseDlg() {
            this.addTovarDialogShow = false;
        },
        showDialog() {
            this.addTovarDialogShow = !this.addTovarDialogShow;
        },

        addTovarToZak(element) {
            this.zakazData.zaktovars.push({
                img: element.img,
                name: element.name,
                count: element.count,
                price: element.price,
                sale: element.sale,
                summ: element.summ
            })

            this.zakazData.shetsumm = 0;
            this.zakazData.zaktovars.forEach(el => {
                this.zakazData.shetsumm += el.summ
            });
            
        },
        generateZn() {
            var nowData = new Date();
            this.zakazData.zaknumber = "ZN_"+nowData.getDate()+"_"+nowData.getMonth()+"_"+nowData.getMilliseconds()+"_"+Math.floor(Math.random() * 1000);
            this.zakazData.data = new Date().toJSON().slice(0, 19).replace('T', ' ')
        },

        addZakToBase(status) {
            console.log(this.zakazData.data);
            console.log(this.zakazData.datafinal);
            console.log(this.zakazData.adr);
            
            if (this.$refs.addZakForm.validate())
            {
                axios.get(this.REST_API_PREFIX + 'add_zak',
                {
                    params: {
                        zakinfo: this.zakazData,
                        status:status
                    }
                })
                .then( (resp) => {
                    this.message = "Данные добавленны"
                    this.alertType = "success";
                    this.showAlert = true;
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

</style>