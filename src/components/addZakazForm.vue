<template>
    <v-container class = "pd-2">
       <v-row>
            <v-col>
                <h1>Создать заказ</h1>
            </v-col>
        </v-row>
        <v-form>
            <v-row >
                <v-col cols="6" sm = "12">
                    <v-text-field label="Клиент" prepend-inner-icon="mdi-account" ></v-text-field>
                </v-col>
                <v-col cols="3" sm = "12">
                    <v-text-field v-model="phone" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone" ></v-text-field>
                </v-col>
                <v-col cols="3" sm = "12">
                    <v-text-field  v-model="phone2" v-mask="'+# (###) ###-##-##'" label="Телефон" prepend-inner-icon="mdi-card-account-phone-outline" ></v-text-field>
                </v-col>
            </v-row>
                
            <v-row>
                <v-col>
                    <v-text-field label="Адрес доставки" prepend-inner-icon="mdi-map-marker-multiple" ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-text-field label="Номер счета" prepend-inner-icon="mdi-file-document" ></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field label="Сумма счета" prepend-inner-icon="mdi-currency-rub" ></v-text-field>
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
            phone2:""
        }
    }
}
</script>

<style>

</style>