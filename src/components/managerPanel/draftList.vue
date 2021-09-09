<template>
    <v-container class = "pd-2" >
        <h1>Черновики заказов</h1>      
          <v-row>
            <v-col>
              <v-form>
                <v-text-field label="Введите запрос" prepend-inner-icon="mdi-magnify" ></v-text-field>
              </v-form>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
                <v-data-table
                locale="ru-RU"
                :headers="headers"
                :items="desserts"
                :items-per-page="5"
                item-key="name"
                class="elevation-1"
                :footer-props="{
                  showFirstLastPage: true,
                  firstIcon: 'mdi-arrow-collapse-left',
                  lastIcon: 'mdi-arrow-collapse-right',
                  prevIcon: 'mdi-minus',
                  nextIcon: 'mdi-plus',
                  itemsPerPageText:'Записей на странице',
                  pageText: '{0}-{1} из {2}'
                }"
              ></v-data-table>
            </v-col>
          </v-row>
        </v-container>
</template>

<script>
export default {
    data() {
        return{
            headers: [
                {
                    text: 'Номер заказа',
                    align: 'start',
                    value: 'number',
                },
                { text: 'Дата', value: 'data' },
                { text: 'Клиент', value: 'contragent' },
                { text: 'Телефон', value: 'phone' },
                { text: 'Сумма', value: 'summ' },
            ],
            desserts: [
                {
                    number: 'LS_000213',
                    data: '20.08.2021',
                    contragent: 'Дизайнер Иванов',
                    phone: '+7 903 633-08-01',
                    summ: '35000',
                },
                {
                    number: 'LS_000413',
                    data: '22.08.2021',
                    contragent: 'Клеткин',
                    phone: '+7 903 633-08-01',
                    summ: '135000',
                },
                {
                    number: 'LS_040200',
                    data: '03.01.2021',
                    contragent: 'Петров',
                    phone: '+7 903 333-08-01',
                    summ: '15000',
                }
            ], 
        }
    }
}
</script>

<style>

</style>