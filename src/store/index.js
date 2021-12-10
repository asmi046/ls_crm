import Vue from 'vue'
import axios from 'axios';
import Vuex from 'vuex'



Vue.use(Vuex)

export default new Vuex.Store ({
    state: {
        rest_api_prefix:"https://lightsnab.ru/wp-json/lscrm/v2/",
        // Поля авторизации
        autorise: false,
        userName: "",
        userEmail: "",
        userStatus: "",
        userPodrazdelenie: "",
        userDolgnost: "",

        loginState:"autorise", //Окно которое отображаетс на странице авторизации / регистрации
        // Поля для меню приложения
        showPanel:false,
        // Статусы заказа
        orderStatuses: ['Новый', 'Черновик', 'В работе', 'Архив'],
        // Список заказов
        orderList:[],
        // Информация о менеджерах
        managerInfo:[]
    },

    actions: {
        updateManagerInfo(ctx) { 
            axios.get(ctx.state.rest_api_prefix + 'get_manager_info',
            {
                params: {
                    querystr: "",
                }
            })
            .then( (resp) => {
                ctx.commit('updateManagerInfo', resp.data);
                console.log(resp.data); 
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
                console.log(rezText);
                
            });
        },

        updateOrderList(ctx, value) {
            axios.get(ctx.state.rest_api_prefix + 'get_zakaz',
            {
                params: {
                    querystr: value.serch_str,
                    status: value.serch_status,
                    mngmail:localStorage.getItem("mail"),
                    mngmailquery:value.search_mail
                }
            })
            .then( (resp) => {
                ctx.commit('updateOrderList', resp.data);
                console.log(resp.data); 
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
                console.log(rezText);
                
            });
        },

        showedPanel(ctx, value){
            ctx.commit('showedPanel', value);
        },

        // Экшкны авторизации
        chengeAutorise(ctx, value){
            ctx.commit('updateAutorise', value);
        },

        chengeUserName(ctx, value){
            ctx.commit('updateUserName', value);
        },

        chengeUserStatus(ctx, value){
            ctx.commit('updateUserStatus', value);
        },

        chengeLoginState(ctx, kpi){
            ctx.commit('updateLoginState', kpi);
        }
    },

    mutations: {
        updateManagerInfo(state, newVal) {
            state.managerInfo = newVal;
        },

        updateOrderList(state, newVal) {
            state.orderList = newVal;
        },

        showedPanel(state, newVal) {
            state.showPanel = newVal;
        },

        // Мутации авторизации
        updateAutorise(state, newVal) {
            state.autorise = newVal;
        },

        updateUserName(state, newVal) {
            state.userName = newVal;
        },

        updateUserStatus(state, newVal) {
            state.userStatus = newVal;
        },
        
        updateLoginState(state, newVal) {
            state.loginState = newVal;
        }

    },
    
    getters: {
        USER_STATUS(state) {
            return state.userStatus;
        },
        
        MANAGER_EMAIL_LIST(state) {
            let mailList = [];
            
            for (let i = 0; i<state.managerInfo.length; i++)
            {
                mailList.push({name:state.managerInfo[i].fio, mail:state.managerInfo[i].mail });
            }

            return mailList;
        },

        MAIN_ORDER_LIST(state) {
            return state.orderList;
        },
        ORDER_STATUSES(state) {
            return state.orderStatuses;
        },

        SHOW_PANEL(state) {
            return state.showPanel;
        },
        
        REST_API_PREFIX (state) {
            return state.rest_api_prefix;
        },

        AUTORISE (state) {
            return state.autorise;
        },

        USER_NAME (state) {
            return state.userName;
        },

        getLoginState(state){
            return state.loginState;
        },
       
    }
})
