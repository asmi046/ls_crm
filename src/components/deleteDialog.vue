<template>
      <v-dialog
      v-model="deleteDialogParam.showDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Удаление заказа <br/>
          {{deleteDialogParam.number}}
        </v-card-title>

        <v-card-text>
          Вы действительно хотите удалить заказ <strong>{{deleteDialogParam.number}}</strong> из заказа будут удаленывсе товары
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="deleteDialogParam.closeDialog()"
          >
            Отмена
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click="deleteDialogParam.deleteNumber()"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
     props: ['deleteDialogParam'],
}
</script>

<style>

</style>