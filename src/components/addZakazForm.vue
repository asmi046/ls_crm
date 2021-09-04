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
                
                <v-col md = "6" cols = "12">
                    <v-text-field @focus="generateZn" v-model="zakazData.data" label="Дата оформления" prepend-inner-icon="mdi-calendar" readonly ></v-text-field>
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
                    <v-text-field v-model="zakazData.shetsumm"  label="Сумма счета" prepend-inner-icon="mdi-currency-rub" ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-data-table
                        dense
                        :headers="headers"
                        :items="desserts"
                        item-key="name"
                        class="elevation-1"
                        :hideDefaultFooter = "true"
                    ></v-data-table>                    
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
                <v-col md = "3" cols="12">
                    <v-btn color="secondary">
                        <v-icon class="mr-2">mdi-plus</v-icon> Добавить товар
                    </v-btn>
                </v-col>

                <v-col md = "4" cols="12">
                    <v-btn color="success">
                        <v-icon class="mr-2">mdi-content-copy</v-icon> Копировать с другой датой
                    </v-btn>
                </v-col>
                <v-col md = "3" cols="12" class = "ml-auto justify-xl-end justify-md-end d-flex .d-md">
                    <v-btn @click.prevent="addZakToBase" color="success">
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

export default {
    data() {
        return {
            zakazData: {
                zaknumber:"",
                data:"",
                name:"",
                phone:"",
                phone2:"",
                adr:"",
                shetn:"",
                shetsumm:""
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
                {text: "Наименование", value: "name"},
                {text: "Количество", value: "count"},
                {text: "Цена", value: "price"},
                {text: "Сумма", value: "summ"}
            ],

             desserts: [ 
                 {
                    name: "Лампа №1",
                    count: 1,
                    price: 500,
                    summ: 500
                 },
                 {
                    name: "Лампа №2",
                    count: 3,
                    price: 1000,
                    summ: 3000
                 },
                 {
                    name: "Лампа №3",
                    count: 3,
                    price: 5000,
                    summ: 15000
                 }
             ]
        }
    },
    
    computed: {
            ...mapGetters (["REST_API_PREFIX"])
    },

    created: function() {
        this.generateZn()
    },

    methods:{
        generateZn() {
            var nowData = new Date();
            this.zakazData.zaknumber = "ZN_"+nowData.getDate()+"_"+nowData.getMonth()+"_"+nowData.getMilliseconds()+"_"+Math.floor(Math.random() * 1000);
            this.zakazData.data = new Date().toJSON().slice(0, 19).replace('T', ' ')
        },

        addZakToBase() {
            if (this.$refs.addZakForm.validate())
            {
                axios.get(this.REST_API_PREFIX + 'add_zak',
                {
                    params: {
                        zakinfo: this.zakazData
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