<template>
  <div>
        <add-zakaz-form v-show="selectedItem == 1"></add-zakaz-form>
        <draft-list v-show="selectedItem == 2"></draft-list>
        <v-container v-show="selectedItem == 0" class = "pd-2" >
          
          <v-row>
            <v-col>
              <v-form>
                <v-text-field label="Введите запрос" prepend-inner-icon="mdi-magnify" ></v-text-field>
              </v-form>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-btn tile :color="(!showCalendar)?'success':'error'"  @click.prevent="showCalendar = !showCalendar">
                <v-icon left>mdi-calendar</v-icon>
                  <span v-text = "(!showCalendar)?'Показать календарь':'Скрыть календарь'">Показать календарь</span>
              </v-btn>              
            </v-col>
          </v-row>
          
          <v-row v-show = "showCalendar">
            <v-col>
                <v-sheet width="100%">
                  <v-calendar locale="ru"  :type = "type" :events = "events" @change="getEvents"></v-calendar>
                </v-sheet>
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
  </div>
</template>

<script>
import addZakazForm from './addZakazForm.vue';
import DraftList from './draftList.vue';
export default {
    components: { addZakazForm, DraftList },
  data() {
    return {  
      
      showMenu:false,
      type:"month",
      events:[],
      showCalendar:false,


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
  },

      methods: {
        getEvents () {
          console.log("ddd");
          let ev =[];
          ev.push({
          name:"Событие #1",
          start:new Date(),
          
          });

          this.events = ev;
          console.log(this.events);
        }
      }
}
</script>

<style>

</style>