<template>
    <div class = "loginBlk">
        <h2>Регистрация</h2>
        <form class = "windowForm" action="" id="registerForm">
            <v-text-field
            v-model = "reginformation.fio"
            type = "text"
            label = "Ф.И.О."
            placeholder="введите Ф.И.О."
            ></v-text-field>
            
            <v-text-field
            v-model = "reginformation.mail"
            type = "email"
            label = "e-mail"
            placeholder="введите e-mail"
            ></v-text-field>
            
            <v-text-field
            v-model = "reginformation.dolgnost"
            type = "text"
            label = "Должность"
            placeholder="введите должность"
            ></v-text-field>
            
            <v-text-field
            v-model = "reginformation.pass"
            type = "password"
            label = "Пароль"
            placeholder="введите пароль"
            ></v-text-field>

            <v-btn
            color="success"
            @click.prevent="registerUser"
            >Регистрация</v-btn>
        </form>
        <v-alert
        border="right"
        colored-border
        type="error"
        elevation="2"
        v-show="errorMsgVisible"
        >{{errorMsg}}</v-alert>
        
        <!-- <form-msg :error-msg = "errorMsg" :error-msg-ok = "errorMsgOk"  :error-msg-visible = "errorMsgVisible"></form-msg> -->

        <a @click.prevent="toAutorise" href="#" class="controlLnk">Войти в систему</a>
       
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {  
                reginformation: {
                    fio: "",
                    mail: "",
                    podrazdelenie: "",
                    dolgnost: "",
                    pass: "",
                },
                errorMsg:"Заполните все обязательные поля помеченные *",
                errorMsgOk: false,
                errorMsgVisible:false
            }
        },

        methods: {
            toAutorise() {
                this.$store.dispatch('chengeLoginState',  "autorise");
            },

            registerUser() {
                this.errorMsgVisible = false;
                this.errorMsgOk = false;
                
                if (
                    (this.reginformation.fio == "") ||
                    (this.reginformation.mail == "")  ||
                    (this.reginformation.podrazdelenie == "") || 
                    (this.reginformation.dolgnost == "") || 
                    (this.reginformation.pass == "")
                    ) {this.errorMsgVisible = true; return;}
                
                axios.get('http://rubexgroup.ru/wp-json/bi/v2/biautorise',
                {
                    params: {
                        reginfo: this.reginformation
                    }
                })
                .then( () => {
                    this.reginformation.fio == "";
                    this.reginformation.mail == "";
                    this.reginformation.podrazdelenie == "";
                    this.reginformation.dolgnost == "";
                    this.reginformation.pass == "";
                    this.errorMsg = "Вы успешно зарегистрированны. Ждите подтверждения регистрации.";
                    this.errorMsgOk = true;
                    this.errorMsgVisible = true;
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
                    this.errorMsg = rezText;
                    this.errorMsgVisible = true;
                });
            }  
        }
    }
</script>

<style scoped>
    .loginBlk {
        margin-bottom: 20px;
    }
</style>