<template>
  <v-dialog
            v-model="showDlg"
            width = "80%"
            
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <v-card>
                <v-toolbar
                dark
                color="primary"
                >
                    <v-btn
                        icon
                        dark
                        @click="closeDlg"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                
                    <v-toolbar-title>Добавление товара</v-toolbar-title>
                
                    <v-spacer></v-spacer>
                    
                </v-toolbar>
                <v-container width = "100%">
                    <v-row>
                        <v-col md = "1" cols = "12">
                        <v-img
                            height="80"
                            width="80"
                            contain
                            :src="returnedData.img"
                        ></v-img>
                        </v-col>
                        <v-col md = "1" cols = "12">
                            <v-text-field
                                v-model = "returnedData.name"
                                @keyup="getBaseTovar"
                                label="Наименование" 
                            >
                            </v-text-field>
                        </v-col>
                        <v-col md = "1" cols = "12">
                            <v-text-field
                                v-model = "returnedData.sku"
                                label="Арт." 
                            >
                            </v-text-field>
                        </v-col>

                        <v-col md = "1" cols = "12">
                            <v-text-field
                                v-model = "returnedData.count"
                                label="Колличество" 
                            >
                            </v-text-field>
                        </v-col>
                        
                        <v-col md = "1" cols = "12">
                            <v-text-field
                                v-model = "returnedData.price"
                                label="Цена" 
                            >
                            </v-text-field>
                        </v-col>
                        
                        <v-col md = "1" cols = "12">
                            <v-text-field
                                v-model = "returnedData.sale"
                                label="Скидка" 
                            >
                            </v-text-field>
                        </v-col>

                        <v-col md = "1" cols = "12">
                            <v-text-field
                                v-model = "calcSumm"
                                label="Сумма" 
                            >
                            </v-text-field>
                        </v-col>

                        <v-col md = "1" cols = "12">
                            <v-select
                                :items="['Шт', 'М']"
                                v-model="returnedData.edin"
                                label="Единицы"
                            ></v-select>
                        </v-col>

                        <v-col md = "1" cols = "12">
                            <v-select
                                :items="nalItems"
                                v-model="returnedData.nal"
                                label="Наличие"
                            ></v-select>
                        </v-col>

                        <v-col md = "1" cols = "12">
                            <v-text-field
                                v-model = "returnedData.comment"
                                label="Комментарий" 
                            >
                            </v-text-field>
                        </v-col>

                        <v-col class = "d-flex justify-end" md = "2" cols = "12">
                            <v-btn @click="addToZakMain" class = "ml"  color="success">
                                <v-icon  class="mr-2">mdi-plus</v-icon> в заказ
                            </v-btn>
                        </v-col>
                    </v-row>
                    
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model = "tovName"
                                @keyup="getBaseTovar"
                                label="Поиск по базе" 
                                prepend-inner-icon="mdi-magnify" 
                            >   
                            </v-text-field>
                        </v-col>
                    </v-row>
                    
                    <v-row>
                        <v-col>
                            <div class = "pdsList">
                                <div v-for="(item, i) in baseArray" :key="i" class="pdsElement">
                                    <div class="imgWrp">
                                        <img :src="item.lnk" />
                                    </div>
                                    
                                    <div class="name">
                                        <h3>{{item.name}}</h3>
                                        <span>
                                            {{item.name}}
                                        </span>
                                    </div>

                                    <div class="control">
                                        <v-btn
                                        class="mx-2"
                                        fab
                                        height="30px"
                                        width="30px"
                                        color="success"
                                        @click="selectTovar(item)"
                                        >
                                        <v-icon dark>
                                            mdi-plus
                                        </v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex'
export default {
    props: ['showDlg','closeDlg','addToZak'],
    data() {
        return {
           returnedData:{
               img: require('../../assets/no_photo.png'),
               name: "",
               sku: "",
               count: 1,
               price: 0,
               sale: 0,
               summ: 0,
               edin:"Шт",
               nal:"Да",
               comment:""
           },
           tovName:"",
           baseArray:[],

           nalItems:["Да", "Нет"]
        }
    },

    computed: {
            ...mapGetters (["REST_API_PREFIX"]),
            calcSumm: function () {
                return (this.returnedData.sale === 0)?(this.returnedData.count * this.returnedData.price):(this.returnedData.count * this.returnedData.price *( 1 - this.returnedData.sale/100)) 
            } 
    },

    methods:{
        addToZakMain() {
            this.addToZak({
                img: this.returnedData.img,
                name: this.returnedData.name,
                sku: this.returnedData.sku,
                count: this.returnedData.count,
                price: this.returnedData.price,
                sale: this.returnedData.sale,
                summ: this.calcSumm,
                edin: this.returnedData.edin,
                nal: this.returnedData.nal,
                comment: this.returnedData.comment
            });
            this.closeDlg();
        },
        selectTovar(item) {
            this.returnedData.img = item.lnk
            this.returnedData.name = item.name
            this.returnedData.sku = item.sku
        },
        getBaseTovar() {
            console.log("Do search");
            if (this.tovName.length >= 3) {
                axios.get(this.REST_API_PREFIX + 'get_tovar',
                {
                    params: {
                        query: this.tovName
                    }
                })
                .then( (resp) => {
                    this.baseArray = resp.data;
                    console.log(this.baseArray);
                })

                .catch((error) => {
                    console.log(error.config);
                });
            }
        }
    }
    
}
</script>

<style>
    .pdsList {
        width: 100%;
        max-height: 200px;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }

    .pdsElement {
        width: 100%;
        display: flex;
        padding: 5px 0;
        border-bottom: 1px solid lightgray;
    }

    .imgWrp {
        width: 50px;
        height: 50px;
        object-fit: cover;
        margin: auto 20px auto 0;
    }

    .control {
        margin: auto 0 auto auto;
    }

    .imgWrp img { 
        width: 100%;
        height: 100%;
    }


    ::-webkit-scrollbar {
    overflow-y: scroll;
    width: 7px;
    background-color: #f9f9fd; }

    ::-webkit-scrollbar-thumb {
    background-color: grey; }

</style>