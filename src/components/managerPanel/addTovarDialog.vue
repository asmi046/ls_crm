<template>
  <v-dialog
            v-model="showDlg"
            fullscreen
            hide-overlay
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
            </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['showDlg','closeDlg'],
    data() {
        return {
           showDlgMain:this.showDlg
        }
    }
    
}
</script>

<style>

</style>