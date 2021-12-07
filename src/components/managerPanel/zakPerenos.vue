<template>
    <v-row class = "d-flex flex-column">
        <v-col>
            <formating-data-piccer v-model="perenosData" show-label = "Дата для переноса"></formating-data-piccer>              
        </v-col>
        <v-col>
            <v-btn color="success">
                <v-icon class="mr-2">mdi-redo-variant</v-icon> Перенести
            </v-btn>
        </v-col>

        <v-col>
            <v-btn color="success">
                <v-icon class="mr-2">mdi-text-box-multiple-outline</v-icon> Скопировать
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import formatingDataPiccer from '../formatingDataPiccer.vue'
export default {
    components: { formatingDataPiccer },
    data() {
        return {
            perenosData:""
        }
    }
}
</script>

<style>

</style>