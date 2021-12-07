<template>
    <v-row class = "d-flex flex-column">
        <v-col>
            <formating-data-piccer v-model="perenosData" show-label = "Дата для переноса"></formating-data-piccer>              
        </v-col>

        <v-col>
            <v-btn @click.prevent = "copyZak" color="success">
                <v-icon  class="mr-2">mdi-text-box-multiple-outline</v-icon> Скопировать
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import formatingDataPiccer from '../formatingDataPiccer.vue'
import {mapGetters} from 'vuex'
import axios from 'axios'
import allLibs from '../../lib/libs';

export default {
    components: { formatingDataPiccer },
    props: ['oldZakNumber'],
    computed: {
            ...mapGetters (["REST_API_PREFIX"])
    },
    data() {
        return {
            perenosData:""
        }
    },
    methods:{ 
        copyZak() {
            let newZn = allLibs.getZn()
            axios.post(this.REST_API_PREFIX + 'copy_zak',
                {
                        oldnumber: this.oldZakNumber,
                        newnumber: newZn,
                        newdata:this.perenosData
        
                })
                .then( (resp) => {
                    console.log(resp);
                    alert("Заказ скопирован под номером "+ newZn);
                    this.$router.push({name:'service'})
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
        }
    }
}
</script>

<style>

</style>