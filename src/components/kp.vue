<template>
    <v-container class = "pd-2" >
        <v-row>
            <v-col>
                <v-btn :disabled="element === undefined" tile color="success" @click="toPDF()"><v-icon left>mdi-file-document-outline</v-icon> Сохранить в PDF</v-btn>
                <v-btn tile color="success" @click="tableToExcel()"><v-icon left>mdi-file-document-outline</v-icon> Сохранить в excel</v-btn>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col>
                <h1>
                    Коммерческое предложение
                </h1>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col>
                <section v-if = "element !== undefined" class = "pdfSection" ref = "pdfKp" slot="pdf-content">    
                    <img style = "margin-bottom: 20px!important;" class = "mb-4" src="../assets/logo.svg" alt="">
                    <hr/>
                    <br/>
                        <strong>Номер заказа:</strong> {{element.zak_numbet}}<br/>
                        <strong>Клиент:</strong> {{element.klient_name}}<br/>
                        <strong>Телефон клиента:</strong> {{element.phone}}, {{element.phone2}}<br/>
                        <strong>Менеджер:</strong> {{element.mng_name}} {{element.mng_mail}}<br/>
                    <br/>
                    <table class = "tov_table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Артикул</th>
                                <th>Фото</th>
                                <th>Наименование</th>
                                <th>Цена</th>
                                <th>Кол-во</th>
                                <th>Итого</th>
                                <th>Наличие</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in tovars" :key="i">
                                <td>{{i+1}}</td>
                                <td>{{item.sku}}</td>
                                <td>
                                    <img  height = "40px" width = "40px" :src = "item.imgBase64">
                                </td>
                                <td>{{item.name}}</td>
                                <td>{{item.price}}</td>
                                <td>{{item.count}}</td>
                                <td>{{item.summ}}</td>
                                <td>{{item.nal}}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section v-else>
                    <p class="obrlnk">Данные не загружены <router-link :to = "{name:'service'}"> Вернуться на главную</router-link></p>
                </section>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import axios from 'axios'
import html2pdf from 'html2pdf.js'

export default {
    data(){
        return {
            element:null,
            tovars:[]
        }
    },


    computed: {
            ...mapGetters (["REST_API_PREFIX", "MAIN_ORDER_LIST"])
    },

    created: function() {
        console.log(this.MAIN_ORDER_LIST);
        this.element = this.MAIN_ORDER_LIST.find((el) =>  el.zak_numbet === this.$route.params.number )

        axios.get(this.REST_API_PREFIX + 'get_order_tovar',
            {
                params: {
                    orderid: this.$route.params.number,
                }
            })
            .then( (resp) => {
              console.log(resp);
              this.tovars = resp.data
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

    methods: {
        tableToExcel() {
            var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) { 	    	 
                return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) 
            }
            , downloadURI = function(uri, name) {
                var link = document.createElement("a");
                link.download = name;
                link.href = uri;
                link.click();
            }

            return function(table, name, fileName) {
                if (!table.nodeType) table = document.getElementById(table)
                    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
                var resuri = uri + base64(format(template, ctx))
                downloadURI(resuri, fileName);
            }
        },

        toPDF() {
            console.log(this.element);
            
            html2pdf(this.$refs.pdfKp, {
					margin: 1,
					filename: this.$route.params.number+'.pdf',
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { dpi: 192, letterRendering: true, useCORS:true },
					jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
				})
        }
    }

}
</script>

<style>
    .pdfSection {
        font-size: 14px;
    }
    
    .tov_table {
        width: 100%;
        border-top:1px solid black;
        border-left:1px solid black;
        border-spacing: unset;
        font-size: 14px;
    }

    .tov_table th,
    .tov_table td
    {
        border-bottom:1px solid black;
        border-right:1px solid black;
        padding: 1px 5px;
        
    }

    .tov_table th{ 
        text-align: left;
    }
</style>