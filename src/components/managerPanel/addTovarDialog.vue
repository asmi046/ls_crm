<template>
  <v-dialog
            v-model="showDlg"
            width = "80%"
            
            hide-overlay
            @click:outside="closeDlg"
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
                                        v-if = "item.addet == false"
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
                                        <v-btn
                                        v-else
                                        class="mx-2"
                                        fab
                                        height="30px"
                                        width="30px"
                                        color="secondary"
                                        >
                                            <v-icon dark>
                                                mdi-check
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-btn
                            tile
                            :color="(!showAddToBase)?'success':'secondary'"
                            @click.prevent="showAddToBase = !showAddToBase"
                            >
                            <v-icon left>mdi-database-export</v-icon>
                            Новый товаров в базу
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row v-show="showAddToBase">
                        <v-col>
                            <tovar-to-base></tovar-to-base>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex'
import tovarToBase from './tovarToBase.vue';
export default {
    components: { tovarToBase },
    props: ['showDlg','closeDlg','addToZak'],
    data() {
        return {
           showAddToBase:false,
           tovName:"",
           baseArray:[],

        }
    },

    computed: {
            ...mapGetters (["REST_API_PREFIX"]),
            calcSumm: function () {
                return (this.returnedData.sale === 0)?(this.returnedData.count * this.returnedData.price):(this.returnedData.count * this.returnedData.price *( 1 - this.returnedData.sale/100)) 
            } 
    },

    methods:{


        selectTovar(item) {
            this.addToZak({
                img: item.lnk,
                name: item.name,
                sku: item.sku,
                count: 1,
                price: 0,
                sale: 0,
                summ: 0,
                edin: "Шт",
                nal: "Да",
                comment: ""
            })
            item.addet = true
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