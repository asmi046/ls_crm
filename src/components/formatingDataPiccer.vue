<template>
    <v-menu
      ref="menu1"
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
      v-bind:value="dateFormatted"
      
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateFormatted"
          :label="showLabel"
          persistent-hint
          prepend-icon="mdi-calendar"
          v-bind="attrs"
          @blur="date = parseDate(dateFormatted)"
          v-on="on"
          readonly
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        no-title
        locale="ru"
        @input="menu1 = false; doEv()"
      ></v-date-picker>
    </v-menu>
</template>

<script>
  export default {
    data: vm => ({
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
      menu1: false,
    }),

    props: ['showLabel', 'value'],

    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
        
      },
    },

    watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
      },

      value(){
        if (this.value.indexOf("-") > 0)
          this.dateFormatted = this.formatDate(this.value)
        else 
          this.dateFormatted = this.value

        this.$emit('change', this.formatDate(this.value))
      }

    },

    methods: {
        doEv() {
                console.log("DO DO DO");
            
                this.$emit('input', this.formatDate(this.date))
        },

      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}.${month}.${year}`
      },
      parseDate (date) {
        if (!date) return null
        const [day, month, year] = date.split('.')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },

    mounted: function() {
        console.log(this.value)
        if (this.value.indexOf("-") > 0)
          this.dateFormatted = this.formatDate(this.value)
        else 
          this.dateFormatted = this.value
          console.log(this.dateFormatted)

          this.$emit('change', this.formatDate(this.value))
    }
  }
</script>

<style>

</style>