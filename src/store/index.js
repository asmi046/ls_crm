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
        userPodrazdelenie: "",
        userDolgnost: "",

        loginState:"autorise", //Окно которое отображаетс на странице авторизации / регистрации
        // Поля для меню приложения
        showPanel:false,
        // Статусы заказа
        orderStatuses: ['Новый', 'Черновик', 'В работе', 'Архив'],
        // Список заказов
        orderList:[]
    },

    actions: {
        updateOrderList(ctx, value) {
            axios.get(ctx.state.rest_api_prefix + 'get_zakaz',
            {
                params: {
                    querystr: value.serch_str,
                    status: value.serch_status
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

        chengeLoginState(ctx, kpi){
            ctx.commit('updateLoginState', kpi);
        }
    },

    mutations: {
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
        
        updateLoginState(state, newVal) {
            state.loginState = newVal;
        }

    },
    
    getters: {
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
