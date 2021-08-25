<template>
    <v-container class = "pd-2">
       <v-row>
            <v-col>
                <h1>Создать заказ</h1>
            </v-col>
        </v-row>
        <v-form>
            <v-row>
                <v-col md = "6" cols = "12">
                    <v-text-field label="Номер заказа" prepend-inner-icon="mdi-tag" ></v-text-field>
                </v-col>
                
                <v-col md = "6" cols = "12">
                    <v-text-field label="Дата оформления" prepend-inner-icon="mdi-calendar" ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col md = "6" cols = "12" >
                    <v-text-field label="Клиент" prepend-inner-icon="mdi-account" ></v-text-field>
                </v-col>
                <v-col md = "3"  cols="12">
                    <v-text-field v-model="phone" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone" ></v-text-field>
                </v-col>
                <v-col  md = "3" cols="12">
                    <v-text-field  v-model="phone2" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone-outline" ></v-text-field>
                </v-col>
            </v-row>
                
            <v-row>
                <v-col >
                    <v-text-field label="Адрес доставки" prepend-inner-icon="mdi-map-marker-multiple" ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col md = "6" cols = "12">
                    <v-text-field label="Номер счета" prepend-inner-icon="mdi-file-document" ></v-text-field>
                </v-col>
                <v-col md = "6" cols = "12">
                    <v-text-field  label="Сумма счета" prepend-inner-icon="mdi-currency-rub" ></v-text-field>
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
                        hideDefaultFooter = "false"
                    ></v-data-table>                    
                </v-col>
            </v-row>
            
            <v-row>
                <v-col>
                    <v-btn color="secondary">
                        <v-icon>mdi-plus</v-icon> Добавить товар
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            phone:"",
            phone2:"",

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
    }
}
</script>

<style>

</style>