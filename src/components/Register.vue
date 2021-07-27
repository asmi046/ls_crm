<template>
    <div class = "loginBlk">
        <h2>Регистрация</h2>
        <form class = "windowForm" action="" id="registerForm">
            <input v-model = "reginformation.fio" type = "text" placeholder="Ф.И.О.*" name = "login_pass" />
            <input v-model = "reginformation.mail" type = "email" placeholder="e-mail*" name = "login_mail" />
            <div class="select-wrap">
                <select v-model = "reginformation.podrazdelenie" name = "login_pas">
                    <option class = "disabled" disabled value="">Выберите подразделение*</option>
                    <option value="Маркетинг">Маркетинг</option>
                    <option value="Отдел продаж">Отдел продаж</option>
                    <option value="ОМТО">ОМТО</option>
                </select>
            </div>
            <!-- <input v-model = "reginformation.mail" type = "text" placeholder="Подразделение" name = "login_pass" /> -->
            <input v-model = "reginformation.dolgnost"  type = "text" placeholder="Должность*" name = "login_pass" />
            <input v-model = "reginformation.pass" type = "password" placeholder="Пароль*" name = "login_pass" />
            <button @click.prevent="registerUser" class = "LoginBtn">Регистрация</button>
        </form>
        
        <form-msg :error-msg = "errorMsg" :error-msg-ok = "errorMsgOk"  :error-msg-visible = "errorMsgVisible"></form-msg>

        <a @click.prevent="toAutorise" href="#" class="controlLnk">Войти в систему</a>
       
    </div>
</template>

<script>
    import axios from 'axios'
    import formMsg from './formMsg.vue';

    export default {
  components: { formMsg },
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